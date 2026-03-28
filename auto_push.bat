@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo --------------------------------------------------------
echo [AUTO-PUSH-MONITOR] Stable Mode Active (Supports Chinese)
echo [PROJECT] %cd%
echo --------------------------------------------------------

:loop
:: Check if there are ANY changes (ignoring temp files)
git status --porcelain | findstr /V ".git/ node_modules/ dist/ auto_push.bat changed.txt" > changed.txt

:: If changed.txt has content (size > 0)
for %%I in (changed.txt) do if %%~zI GTR 0 (
    echo.
    echo %time% [DETECTED] Changes in project...
    type changed.txt
    
    echo [SYNCING] Adding changes...
    :: Use -A but Git is smart with 'fsmonitor', so this will be fast
    git add -A
    git commit -m "Auto sync: %date% %time%" --quiet
    
    echo [PUSHING] Uploading to GitHub...
    git push origin main --quiet
    
    echo [DONE] Precision sync completed.
    echo --------------------------------------------------------
)

:: Wait 3 seconds
timeout /t 3 /nobreak > nul
goto loop
