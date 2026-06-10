param(
    [string]$Message = "safe update"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SYNQ safe push started" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path ".\scripts\check_project.ps1")) {
    Write-Host "Missing scripts\check_project.ps1" -ForegroundColor Red
    exit 1
}

powershell -ExecutionPolicy Bypass -File ".\scripts\check_project.ps1"

Write-Host ""
Write-Host "Git status before commit:" -ForegroundColor Cyan
git status --short

$changes = git status --porcelain

if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host ""
    Write-Host "No changes to commit." -ForegroundColor Yellow
    exit 0
}

git add .

git commit -m "$Message"

git push

Write-Host ""
Write-Host "Safe push completed successfully" -ForegroundColor Green
