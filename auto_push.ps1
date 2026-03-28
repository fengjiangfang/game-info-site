# 🚀 GitHub Auto-Push Watcher (V5 - Ultimate Reliability)
$path = (Get-Item -Path ".\").FullName
$watcher = New-Object IO.FileSystemWatcher
$watcher.Path = $path
$watcher.Filter = '*.*'
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

Write-Host "`n--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "🔥 ULTRA FAST SYNC ACTIVE - MONITORING CHANGES..." -ForegroundColor Green
Write-Host "📍 Path: $path" -ForegroundColor White
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

$timer = [System.Diagnostics.Stopwatch]::StartNew()
$lastPath = ""

while ($true) {
    # 使用等待同步事件，徹底避開 Register-ObjectEvent 的語法問題
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 1000)
    
    if ($change.TimedOut -eq $false) {
        $fullPath = $change.FullPath
        $fileName = $change.Name
        
        # 精確排除系統目錄與排除名單
        if ($fullPath -notmatch 'dist|.git|node_modules|deploy.bat|auto_push.ps1') {
            # 防抖動機制：避免同一個檔案在 3 秒內重複 Push
            if ($lastPath -ne $fullPath -or $timer.ElapsedMilliseconds -gt 3000) {
                Write-Host "`n$(Get-Date -Format 'HH:mm:ss') [SYNCING] $($change.ChangeType) : $fileName" -ForegroundColor Yellow
                try {
                    # 取得相對路徑實現極速 Add
                    $rel = (Resolve-Path -Path $fullPath -Relative)
                    Write-Host "📤 Precision Push: $rel" -ForegroundColor Cyan
                    
                    git add $rel
                    git commit -m "⚡ Sync ($($change.ChangeType)): $fileName" --quiet
                    git push origin main --quiet
                    
                    Write-Host "✅ Streamlined Update Successful!" -ForegroundColor Green
                } catch {
                    Write-Host "⚠️ Skip push: $fileName" -ForegroundColor Gray
                }
                $lastPath = $fullPath
                $timer.Restart()
            }
        }
    }
}
