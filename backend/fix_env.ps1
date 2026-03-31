# NeuroFlow Environment Fix Utility

Write-Host "🚀 Initializing NeuroFlow Environment Sync..." -ForegroundColor Cyan

# 1. Ensure we are in the backend directory
if (!(Test-Path "requirements.txt")) {
    Write-Host "❌ Error: requirements.txt not found. Please run this script inside the 'backend' folder." -ForegroundColor Red
    exit
}

# 2. Upgrade Pip
Write-Host "📦 Upgrading Pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# 3. Install Dependencies
Write-Host "📥 Installing Neural Core Dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# 4. Success Message
Write-Host "`n✅ SUCCESS: Core modules synchronized." -ForegroundColor Green
Write-Host "---------------------------------------------------"
Write-Host "💡 VS CODE FIX FOR RED LINES:"
Write-Host "1. Press 'Ctrl + Shift + P' in VS Code."
Write-Host "2. Type 'Python: Select Interpreter'."
Write-Host "3. Pick the (.venv) or the one where you just installed these modules."
Write-Host "4. Restart the backend: 'python -m uvicorn main:app --reload'"
Write-Host "---------------------------------------------------"
