# 🚀 GitHub Auto-Push Watcher (Filtered Mode)
$watcher = New-Object IO.FileSystemWatcher -Property @{ Path = (Get-Item -Path ".\").FullName; Filter = '*.*'; IncludeSubdirectories = $true; EnableRaisingEvents = $true }
Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING SOURCE ONLY..." -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    # 關鍵修正：精確排除 dist 資料夾，避免編譯循環
    if ($change.TimedOut -eq $false -and $change.FullPath -notmatch '\\dist\\|\\.git\\|node_modules|changed\.txt|auto_push\.ps1') {
        $n = $change.Name
        Write-Host "`n$(Get-Date -Format 'HH:mm:ss') [CHANGE] : $n" -ForegroundColor Yellow
        Write-Host "📦 Building locally..." -ForegroundColor Cyan
        npx @11ty/eleventy --quiet
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
        git add .
        git commit -m "🚀 Auto sync: $n" --quiet
        git push origin main --quiet
        Write-Host "✅ Site updated successfully!" -ForegroundColor Green
        Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
    }
}
