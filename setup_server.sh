#!/bin/bash

# NagarCycle Deployment Script for Qubrid AI (Ubuntu/Debian)

echo "🚀 Starting Deployment Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git unzip

# 2. Install Node.js (v18.x)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node
node -v
npm -v

# 3. Install Global Process Manager (PM2)
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# 4. Install Project Dependencies
echo "📚 Installing dependencies..."
# Ensure we are in the project directory
if [ -f "package.json" ]; then
    npm install
else
    echo "⚠️ package.json not found! Please run this script inside the project folder."
    exit 1
fi

# 5. Start Application
echo "🔥 Starting Server..."
pm2 stop nagarcycle 2>/dev/null || true
pm2 start server.js --name "nagarcycle"

# 6. Save PM2 list and generate startup script
echo "💾 Saving process list..."
pm2 save
pm2 startup

echo "✅ Deployment Complete!"
echo "🌍 App should be running on port 3000 (or configured port)."
echo "👉 You may need to open the relevant port in Qubrid AI Firewall/Security Group."
