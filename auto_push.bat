@echo off
setlocal enabledelayedexpansion

echo --------------------------------------------------------
echo [ULTRA-SPEED DEPLOY] LOCAL BUILD + PUSH MODE
echo [PROJECT] %cd%
echo --------------------------------------------------------

:loop
:: Check for ANY changes (ignoring temp files)
git status --porcelain | findstr /V ".git/ node_modules/ dist/ auto_push.bat changed.txt" > changed.txt

:: If changed.txt has content (size > 0)
for %%I in (changed.txt) do if %%~zI GTR 0 (
    echo.
    echo %time% [DETECTED] Changes in project...
    
    echo [BUILDING] Compiling site locally (fast)...
    call npx @11ty/eleventy --quiet
    
    echo [SYNCING] Adding changes...
    git add .
    git commit -m "Auto-Sync: %date% %time%" --quiet
    
    echo [PUSHING] Uploading to GitHub...
    git push origin main --quiet
    
    echo [DONE] Precision sync completed. Site updated!
    echo --------------------------------------------------------
)

:: Wait 3 seconds
timeout /t 3 /nobreak > nul
goto loop
