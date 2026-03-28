@echo off
echo 🚀 正在準備將變更上傳至 GitHub...
cd /d "%~dp0"

echo 🔍 正在掃描變更...
git add .

echo 📦 正在建立存檔 (Commit)...
git commit -m "✨ Auto update via deploy tool: %date% %time%"

echo 📤 正在快速推送至 GitHub...
git push origin main

echo.
echo ✅ 全部完成！您的網頁已更新。
echo 🔗 網址：https://fengjiangfang.github.io/game-info-site/
echo.
pause
