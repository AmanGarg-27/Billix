# Set Console encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "====================================================" -ForegroundColor Green
Write-Host "🚀  DEPLOYING FULL STACK BILLIX TO VERCEL FOR FREE!  " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "🔐 Step 1: Refreshing your Vercel credentials..." -ForegroundColor Yellow
    Write-Host "👉 Please select your login method in the terminal and authorize it in the browser." -ForegroundColor Cyan
    Write-Host ""
    
    # Run Vercel Login using native shell execution
    npx vercel login
    
    Write-Host ""
    Write-Host "⚡ Step 2: Deploying your full-stack app (Vite + Express) to Vercel..." -ForegroundColor Yellow
    Write-Host "Building client bundle and preparing serverless routes..." -ForegroundColor Cyan
    Write-Host ""
    
    # Run Vercel Deploy
    npx vercel --prod --yes
    
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "🎉  DEPLOYMENT WIZARD COMPLETE!                      " -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ An error occurred during deployment:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Active MongoDB URI used in your cloud connection:" -ForegroundColor DarkGray
Write-Host "👉 mongodb+srv://admin:amangarg1454@billix-cluster.11noxlo.mongodb.net/billix" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to close this terminal..."
