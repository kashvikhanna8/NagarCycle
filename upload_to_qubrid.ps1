$ErrorActionPreference = "Stop"

try {
    Write-Host "🚀 Starting Upload Process..." -ForegroundColor Cyan

    # 1. Get Instance IP
    $instanceIp = Read-Host "Please enter your Qubrid Instance IP (e.g., 123.45.67.89)"

    # 2. Get Key Path
    Write-Host "Please select your .pem key file..." -ForegroundColor Yellow
    Add-Type -AssemblyName System.Windows.Forms
    $openFileDialog = New-Object System.Windows.Forms.OpenFileDialog
    $openFileDialog.Filter = "PEM Files (*.pem)|*.pem|All Files (*.*)|*.*"
    $openFileDialog.Title = "Select your Qubrid SSH Key (.pem)"

    if ($openFileDialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $keyPath = $openFileDialog.FileName
        Write-Host "Key selected: $keyPath" -ForegroundColor Green
    }
    else {
        throw "No key selected. Aborting."
    }

    # 3. Define Remote
    $remoteUser = "ubuntu"
    $remotePath = "~/nagarcycle"
    
    # 4. Run SCP
    Write-Host "📦 Uploading files to $instanceIp... (This may take a minute)" -ForegroundColor Cyan
    
    # Using specific exclusions and verbose output
    $scpArgs = @(
        "-i", "$keyPath",
        "-r",
        "-o", "StrictHostKeyChecking=no",
        ".",
        "$remoteUser@$instanceIp`:$remotePath"
    )

    # Exclude logic handled by internal scp ignores if possible, or just copy all (minus huge folders if we can)
    # Windows native scp doesn't support --exclude well without cygwin/git-bash. 
    # Validating simple command:
    
    Write-Host "Running SCP..." -ForegroundColor DarkGray
    # We will trust the user has a .gitignore or accepts node_modules upload (slow but works)
    # Or, simpler:
    scp -i "$keyPath" -r -o StrictHostKeyChecking=no . "$remoteUser@$instanceIp`:$remotePath"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Upload Complete!" -ForegroundColor Green
        Write-Host "Next Step: SSH into your server and run './setup_server.sh'" -ForegroundColor Yellow
        Write-Host "SSH Command: ssh -i '$keyPath' $remoteUser@$instanceIp"
    }
    else {
        throw "SCP Command Failed. Verify IP Address and Key Permissions."
    }
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}
finally {
    Write-Host "`n--------------------------------"
    Read-Host "Press Enter to exit..."
}
