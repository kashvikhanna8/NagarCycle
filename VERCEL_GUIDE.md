# Deploying to Vercel (via GitHub)

Since your project has a frontend (HTML/JS) and a backend (Express/Node.js), Vercel is a specific hosting choice. I have configured `vercel.json` to make this work.

## Step 1: Push to GitHub
1.  **Initialize Git** (if not done):
    ```bash
    git init
    git add .
    git commit -m "Ready for Vercel"
    ```
2.  **Create a Repository** on GitHub (e.g., `nagarcycle-app`).
3.  **Push your code**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/nagarcycle-app.git
    git push -u origin master
    ```

## Step 2: Deploy on Vercel
1.  Go to [Vercel.com](https://vercel.com) and Log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import** your `nagarcycle-app` repository from GitHub.

## Step 3: Configure Environment
**CRITICAL:** Vercel does not use your local `.env` file for security. You must add them in the Vercel Dashboard.

1.  On the "Configure Project" screen, assume defaults for "Build Command" and "Output Directory" (leave them empty or default).
2.  Expand **"Environment Variables"**.
3.  Add the keys from your local `.env` file:
    *   `GEMINI_API_KEY`: ...
    *   `HF_API_TOKEN`: ...
    *   `QUBRID_API_KEY`: `k_2cae...` (The key we just added!)
    *   `MONGO_URI`: ... (If you have a real Mongo DB, otherwise the app uses mocks)

## Step 4: Deploy
Click **Deploy**.
Vercel will build your site. Since we added `vercel.json`, it knows to routing `/api` calls to your Express server and serving the `index.html` as the main site.

## Troubleshooting
*   **Static Assets**: If images/CSS don't load, ensure they are in the root folder (which they are).
*   **API Errors**: Check the "Logs" tab in Vercel.
