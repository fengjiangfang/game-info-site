# 🚀 GitHub Auto-Push Watcher (V3 - Stable)
$path = (Get-Item -Path ".\").FullName

$watcher = New-Object IO.FileSystemWatcher
$watcher.Path = $path
$watcher.Filter = '*.*'
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "👀 Monitoring changes... KEEP THIS WINDOW OPEN." -ForegroundColor Green
Write-Host "📍 Path: $path" -ForegroundColor White
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

$action = {
    $itemPath = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    $fileName = [System.IO.Path]::GetFileName($itemPath)
    
    # 排除不需要追蹤的清單
    if ($itemPath -notmatch 'dist|.git|node_modules|deploy.bat|auto_push.ps1') {
        Write-Host ""
        Write-Host "$(Get-Date -Format 'HH:mm:ss') [DETECTED] $changeType : $fileName" -ForegroundColor Yellow
        Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
        git add .
        git commit -m "🚀 Auto update ($changeType): $fileName"
        git push origin main
        Write-Host "✅ Done! Site updating..." -ForegroundColor Green
    }
}

$handlers = @()
$handlers += Register-ObjectEvent $watcher "Changed" -Action $action
$handlers += Register-ObjectEvent $watcher "Created" -Action $action
$handlers += Register-ObjectEvent $watcher "Deleted" -Action $action
$handlers += Register-ObjectEvent $watcher "Renamed" -Action $action

try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $handlers | Unregister-Event
    $watcher.Dispose()
}
