# 🚀 GitHub Auto-Push Watcher (Pure Filter Mode)
$watcher = New-Object IO.FileSystemWatcher -Property @{ Path = (Get-Item -Path ".\").FullName; Filter = '*.*'; IncludeSubdirectories = $true; EnableRaisingEvents = $true }
Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING SOURCE ONLY..." -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if ($change.TimedOut -eq $false) {
        $p = $change.FullPath
        # 使用更穩定的 Contains 檢查，徹底排除排除清單
        $isIgnored = ($p.Contains("\.git\") -or $p.Contains("\dist\") -or $p.Contains("node_modules") -or $p.Contains("changed.txt") -or $p.Contains("auto_push.ps1"))
        
        if (-not $isIgnored) {
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
}
