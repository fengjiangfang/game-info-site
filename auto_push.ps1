# 🚀 GitHub Auto-Push Watcher (Shielded Mode)
$watcher = New-Object IO.FileSystemWatcher -Property @{ Path = (Get-Item -Path ".\").FullName; Filter = '*.*'; IncludeSubdirectories = $true; EnableRaisingEvents = $true }
Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING SOURCE ONLY..." -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    # 核心修復：強制排除 .git 目錄下的所有變動，並排除 dist 與暫存檔
    if ($change.TimedOut -eq $false -and $change.FullPath -notmatch '\\\.git\\|\\dist\\|node_modules|changed\.txt|auto_push\.ps1') {
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
