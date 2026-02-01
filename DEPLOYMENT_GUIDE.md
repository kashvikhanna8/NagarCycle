# Deploying NagarCycle to Qubrid AI

Since Qubrid AI provides GPU-accelerated Virtual Machines (VMs), we will deploy the application as a **Node.js service** on a Linux Instance.

## Step 1: Launch Qubrid Instance
1.  **Log in** to your Qubrid AI Console.
2.  **Create Instance**: Launch a new **CPU** or **GPU** Instance (Ubuntu 20.04 or 22.04 LTS is recommended).
3.  **SSH Access**: Ensure you download the SSH Key (`.pem` file) or set a password to access the server.
4.  **Open Ports**: In the Network/Security settings, ensure **Port 3000** (or 80) is open to the public so you can access the website.

## Step 2: Connect to the Server
Open your terminal (PowerShell or Command Prompt) and connect via SSH:
```bash
ssh -i path/to/key.pem ubuntu@<YOUR_INSTANCE_IP>
```

## Step 3: Upload Code
You can upload your code in two ways:

### Option A: Using Git (Recommended)
1.  Push your code to GitHub.
2.  Clone it on the server:
    ```bash
    git clone https://github.com/yourusername/nagarcycle.git
    cd nagarcycle
    ```

### Option B: Using SCP (If code is only on your laptop)
Run this command from your local computer folder:
```bash
scp -i path/to/key.pem -r . ubuntu@<YOUR_INSTANCE_IP>:~/nagarcycle
```

## Step 4: Run the Setup Script
I have created a `setup_server.sh` script to automate the installation.

1.  **Move to the project folder** on the server:
    ```bash
    cd ~/nagarcycle
    ```
2.  **Make script executable**:
    ```bash
    chmod +x setup_server.sh
    ```
3.  **Run it**:
    ```bash
    ./setup_server.sh
    ```

This script will:
*   Install **Node.js**.
*   Install **PM2** (to keep the app running in the background).
*   Install all libraries (`npm install`).
*   Start the server.

## Step 5: Verify
Visit your instance IP in the browser:
`http://<YOUR_INSTANCE_IP>:3000`

---
**✅ .env Configuration:**
I have already updated your local `.env` file with the correct **Qubrid API Key**.
When you upload your code (via SCP), this file will be copied automatically, so **no manual configuration is needed** on the server!
