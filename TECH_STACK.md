# 🛠️ Waste-to-Wealth Platform: Tech Stack Documentation

This document explicitly details the architectural decisions, technologies, and theoretical implementations used in this project.

## 1. 🧠 Artificial Intelligence (The Core)

The application uses a **Multi-Tiered AI Architecture** to ensure reliability and accuracy.

### Primary Tier: Google Gemini 2.0 Flash (Multimodal LLM)
- **Role**: Main engine for image analysis and chatbot interactions.
- **Library**: `@google/generative-ai` (Google's official Node.js SDK).
- **Theoretical Implementation**: 
  - **Zero-Shot & Few-Shot Prompting**: We provide the model with a system prompt that defines the persona ("Expert Waste Classifier") and the output format (Strict JSON). We do not fine-tune the model weights; instead, we rely on the model's massive pre-trained knowledge base to generalize across waste types.
  - **Context Window**: Accepts text + base64 image data concurrently.
- **Why Flash?**: Chosen for its balance of extremely low latency and high reasoning capability, essential for a real-time user experience.

### Fallback Tier: Hugging Face Inference API (Computer Vision)
- **Role**: Failsafe mechanism if Gemini is unavailable or rate-limited.
- **Library**: Native Node.js `fetch` API.
- **Model**: `google/vit-base-patch16-224` (Vision Transformer).
- **Theoretical Implementation**:
  - **Vision Transformers (ViT)**: Unlike CNNs that process pixels, ViT splits images into patches (16x16), linearly embeds them, and feeds them into a standard Transformer encoder. This allows it to capture global context better than traditional CNNs.
  - **Inference**: We make a RESTful POST call to the Hugging Face Router, which spins up a serverless container to process the image and return classification logits (probabilities).

---

## 2. 🔙 Backend Infrastructure

The server acts as an orchestration layer, handling API requests and business logic.

- **Runtime**: **Node.js** (Asynchronous, event-driven architecture).
- **Framework**: **Express.js** 5.0 (Modern web framework).
- **Key Middleware**:
  - `multer`: Handles `multipart/form-data` uploads. We use **MemoryStorage** to keep images in RAM (as Buffers) rather than writing to disk, speeding up the pipeline to the AI service.
  - `cors`: Cross-Origin Resource Sharing to allow the frontend to talk to the backend securely.
  - `dotenv`: Loads environment variables (`.env`) to keep API keys secure.

### API Architecture
- **Endpoint**: `POST /api/ai/analyze`
- **Flow**: Client -> Uploads Image -> Middleware (Buffer) -> AI Service (Gemini/HF) -> JSON Response -> Client.

---

## 3. 🎨 Frontend (User Experience)

Built with **Vanilla JavaScript (ES6+)** for maximum performance without the overhead of heavy SPA frameworks.

- **Design System**: 
  - **Glassmorphism**: Usage of `backdrop-filter: blur(12px)` and semi-transparent backgrounds to create depth.
  - **CSS Variables**: Global variables in `style.css` for consistent theming.
- **Logic Layers**:
  - `pricingEngine.js`: A deterministic rule engine. While AI provides the *qualitative* data (Type: Plastic, Quality: 8/10), this engine provides the *quantitative* pricing (`Base_Rate * Weight * Quality_Multiplier`). This ensures fair, predictable pricing independent of AI hallucinations.
  - `trashtalk.js`: Controls the chatbot UI, injecting HTML dynamically and managing the chat history state.

---

## 4. 🗄️ Database & Auth

- **Authentication**: **Google Firebase Auth**.
  - Uses OAuth 2.0 via `signInWithPopup`.
  - Manages session tokens client-side, reducing server state complexity.
- **Data Persistence**: 
  - **MongoDB** (via Mongoose): Configured for scalable data storage (users, transaction history).
  - **Local Storage** (Browser): Used for ephemeral state (passing analysis results from the Chatbot to the Listing page).

---

## 5. 🚀 Deployment & DevOps

- **Local Development**: Runs on `localhost:5000`.
- **Environment Management**: Strict separation of secrets via `.env` files (git-ignored).
- **Architecture Type**: **Monolithic** (Server serves both API and Static Assets), which simplifies deployment and reduces cold-start times for this scale of application.

---

## Summary of Data Flow

1. **User** uploads photo of waste.
2. **Frontend** sends image to **Express Server**.
3. **AI Service** converts image to Base64 and asks **Gemini**: *"What is this? Return JSON."*
4. **Gemini** analyzes pixel data and returns `{ "type": "Plastic", "quality": 8 }`.
5. **Pricing Engine** calculates: `Plastic_Base_Rate (₹12) * Quality (0.8) * Demand (1.1)`.
6. **Frontend** displays total estimated value to user.
