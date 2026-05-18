@echo off
title Billix Vercel Deployer
echo ====================================================
echo 🚀  DEPLOYING FULL STACK BILLIX TO VERCEL FOR FREE!  
echo ====================================================
echo.
echo This wizard will deploy both your React frontend and 
echo Express API endpoints to Vercel completely for free.
echo.
echo Press any key to start...
pause
echo.
echo 🔐 Step 1: Refreshing your Vercel credentials...
echo 👉 Select your login method in the terminal and authorize it in your browser.
echo.
cmd /c "npx vercel login"
echo.
echo ⚡ Step 2: Deploying your full-stack app (Vite + Express) to Vercel...
echo Building client bundle and preparing serverless routes...
echo.
cmd /c "npx vercel --prod"
echo.
echo ====================================================
echo 🎉  DEPLOYMENT COMPLETED!                           
echo ====================================================
echo.
echo Active MongoDB URI used in your cloud connection:
echo 👉 mongodb+srv://admin:amangarg1454@billix-cluster.11noxlo.mongodb.net/billix
echo.
pause
