@echo off
echo ====================================================
echo 🚀 DEPLOYING FULL STACK BILLIX TO VERCEL FOR FREE!  
echo ====================================================
echo.
echo This script will package and deploy your entire app:
echo   - Vite React Frontend (served from global CDN)
echo   - Express Backend (served as a Serverless Function)
echo.
echo If this is your first time, it will automatically open 
echo your browser to log in / sign up to Vercel (100% Free).
echo.
echo Press any key to start...
pause
echo.
echo 🔐 Refreshing credentials. Please select your login method in the browser...
call npx vercel login
echo.
echo 🚀 Deploying to Vercel in zero-config mode...
call npx vercel --prod --yes
echo.
echo ====================================================
echo 🎉 DEPLOYMENT COMPLETED! CHECK THE LINK ABOVE!      
echo ====================================================
pause
