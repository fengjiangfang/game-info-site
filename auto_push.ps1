# 🚀 GitHub Auto-Push Watcher (Ironclad Filter Mode)
$watcher = New-Object IO.FileSystemWatcher -Property @{ Path = (Get-Item -Path ".\").FullName; Filter = '*.*'; IncludeSubdirectories = $true; EnableRaisingEvents = $true }
Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING SOURCE ONLY..." -ForegroundColor Green
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
while ($true) {
    # 阻塞式等待，減少 CPU 消耗
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    if ($change.TimedOut -eq $false) {
        $p = $change.FullPath.ToLower()
        # 終極防禦：只要路徑包含這些關鍵字，一律擋掉
        $ignored = $false
        if ($p -like "*\.git\*" -or $p -like "*/.git/*" -or $p -like "*\dist\*" -or $p -like "*/dist/*" -or $p -like "*node_modules*" -or $p -like "*changed.txt*" -or $p -like "*auto_push.*") {
            $ignored = $true
        }
        
        if (-not $ignored) {
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
