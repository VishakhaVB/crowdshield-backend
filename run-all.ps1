# Run-All helper: opens two new PowerShell windows for backend & frontend, then runs verifiers
# Usage: Right-click -> Run with PowerShell, or from terminal: .\run-all.ps1

$repo = 'D:\mahakubha react'
$serverDir = Join-Path $repo 'backend'
$clientDir = Join-Path $repo 'frontend\client'

Write-Host "Starting backend in new window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$serverDir'; npm run start"

Start-Sleep -Seconds 2
Write-Host "Starting frontend in new window..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$clientDir'; npm run dev"

# Wait for services to initialize
Write-Host "Waiting 6 seconds for services to initialize..."
Start-Sleep -Seconds 6

try {
    node (Join-Path $repo 'backend\verify_backend.js')
} catch {
    Write-Host "verify_backend.js failed: $_"
}

try {
    node (Join-Path $repo 'backend\verify_pilgrim.js')
} catch {
    Write-Host "verify_pilgrim.js failed: $_"
}

Write-Host "Run-all finished. Check the new windows for live logs and this window for verification output."