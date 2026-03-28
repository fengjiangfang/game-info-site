# 🚀 GitHub Auto-Push Watcher
$path = (Get-Item -Path ".\").FullName
$filter = '*.*'

$watcher = New-Object IO.FileSystemWatcher
$watcher.Path = $path
$watcher.Filter = $filter
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "👀 Monitoring changes... KEEP THIS WINDOW OPEN." -ForegroundColor Green
Write-Host "📍 Path: $path" -ForegroundColor White
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    if ($path -notmatch 'dist|.git|node_modules|deploy.bat|auto_push.ps1') {
        Write-Host "$(Get-Date -Format 'HH:mm:ss') [DETECTED] $changeType : $path" -ForegroundColor Yellow
        Write-Host "📤 Launching auto-push tool..." -ForegroundColor Yellow
        & ".\deploy.bat"
    }
}

Register-ObjectEvent $watcher "Changed" -Action $action
Register-ObjectEvent $watcher "Created" -Action $action
Register-ObjectEvent $watcher "Deleted" -Action $action
Register-ObjectEvent $watcher "Renamed" -Action $action

while ($true) { Start-Sleep -Seconds 5 }
