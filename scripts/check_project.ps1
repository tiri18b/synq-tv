param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "SYNQ project check started" -ForegroundColor Cyan

if (!(Test-Path ".\package.json")) {
    Write-Host "package.json not found. Run this script from the project root." -ForegroundColor Red
    exit 1
}

if (!(Test-Path ".\src\pages\TV.jsx")) {
    Write-Host "TV.jsx not found." -ForegroundColor Red
    exit 1
}

if (!(Test-Path ".\src\pages\Admin.jsx")) {
    Write-Host "Admin.jsx not found." -ForegroundColor Red
    exit 1
}

if (!(Test-Path ".\src\assets\building.jpeg")) {
    Write-Host "Warning: src\assets\building.jpeg not found." -ForegroundColor Yellow
}

node -v
npm -v

if (!$SkipInstall) {
    if (!(Test-Path ".\node_modules")) {
        Write-Host "node_modules not found. Running npm install..." -ForegroundColor Yellow
        npm install
    }
}

npm run build

Write-Host ""
Write-Host "Project check passed successfully" -ForegroundColor Green
