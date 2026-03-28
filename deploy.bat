@echo off
setlocal enabledelayedexpansion

echo --------------------------------------------------------
echo [DEPLOY-TOOL] Starting Manual Build and Push...
echo --------------------------------------------------------

:: 🛠️ 本地編譯 (加上生產環境路徑前綴)
echo [1/3] Building site for production...
call npm run build

:: 📤 加入變更與推送
echo [2/3] Adding changes to Git...
git add .
git commit -m "🚀 Content: Update from manual deploy (%date% %time%)"

echo [3/3] Uploading to GitHub...
git push origin main

echo --------------------------------------------------------
echo ✅ DONE! Your site is live and synced.
echo --------------------------------------------------------
pause
