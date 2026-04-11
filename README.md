# ♻️ Waste-to-Wealth Platform

![Platform Banner](logo_final.jpg)

**Waste-to-Wealth** is an AI-powered marketplace and classification platform that bridges the gap between individuals disposing of waste and recycling facilities. It uses cutting-edge Multimodal AI to instantly classify discarded materials from a simple photograph, assess their quality, and calculate fair, real-time market value estimates.

## ✨ Key Features
- **🧠 Zero-Shot AI Classification**: Employs Google's Gemini 2.0 Flash Multimodal LLM to analyze images and return highly-structured JSON profiles of the waste.
- **💰 Deterministic Pricing Engine**: Calculates accurate, fair-market payouts based on material type, weight, real-time demand multipliers, and the AI's quality assessment.
- **🤖 Built-in "TrashTalk" Assistant**: An interactive AI chatbot that guides users through the disposal process.
- **🔒 Secure Authentication**: Powered by Firebase Auth for seamless, secure user logins.
- **✨ Glassmorphism UI**: A beautifully crafted, vanilla JavaScript & CSS dashboard prioritizing an excellent user experience.

## 🛠️ Technology Stack
- **Frontend**: Vanilla JS (ES6+), HTML5, CSS3 Variables, Glassmorphic Design Patterns.
- **Backend Orchestration**: Node.js, Express.js (v5.0), Multer (memory buffering).
- **Artificial Intelligence**: `@google/generative-ai` (Gemini API), Hugging Face Inference API (Fallback ViT Models), OpenAI.
- **Database & Auth**: MongoDB (Mongoose), Google Firebase Authentication.

*For a deep dive into the architecture, check out the [TECH_STACK.md](./TECH_STACK.md) file.*

## 🚀 Running the Project Locally

### 1. Requirements
- Node.js (v18 or higher)
- Firebase Account (for auth config)
- Gemini / OpenAI API Keys

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
git clone https://github.com/kashvikhanna8/HACKATHON.git
cd HACKATHON
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the necessary API keys based on the backend dependencies:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_key_here
```

### 4. Start the Server
```bash
npm start
```
The server will bind to `localhost:5000`. Open your browser and navigate to `http://localhost:5000` to interact with the platform.

---
*Developed during the Hackathon to revolutionize sustainable waste management.*
