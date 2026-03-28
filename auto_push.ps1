# 🚀 GitHub Auto-Push Watcher (Direct System Watcher)
$watcher = New-Object IO.FileSystemWatcher -Property @{ Path = (Get-Item -Path ".\").FullName; Filter = '*.*'; IncludeSubdirectories = $true; EnableRaisingEvents = $true }
Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING..." -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if ($change.TimedOut -eq $false -and $change.FullPath -notmatch 'dist|.git|node_modules|deploy.bat|auto_push.ps1|changed.txt') {
        $n = $change.Name
        Write-Host "`n$(Get-Date -Format 'HH:mm:ss') [SYNCING] : $n" -ForegroundColor Yellow
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
