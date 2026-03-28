@echo off
:: Use UTF-8 Encoding
chcp 65001 > nul
setlocal enabledelayedexpansion

echo --------------------------------------------------------
echo [MONITOR] AUTO-PUSH ACTIVE - KEEP THIS WINDOW OPEN
echo [PATH] %cd%
echo --------------------------------------------------------

:loop
:: Scan for modified (M) or added (A) text files
git status --porcelain | findstr /R "^.M .A" | findstr /V "images/ .git/ node_modules/ dist/" > changed_files.tmp

:: Check if changed_files.tmp size is greater than 0
for %%I in (changed_files.tmp) do if %%~zI GTR 0 (
    echo.
    echo %time% [DETECTED] Changes in source files!
    type changed_files.tmp
    
    echo [SYNC] Uploading to GitHub...
    git add .
    git commit -m "Auto-sync: %date% %time%" --quiet
    git push origin main --quiet
    
    echo [DONE] Site updated on GitHub.
    echo --------------------------------------------------------
)

:: Wait for 3 seconds before next scan
timeout /t 3 /nobreak > nul
goto loop
