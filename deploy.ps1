# Landhotel Schend — Deploy zu Hetzner (https://schend.conexadigital.eu)
#
# Verwendung:
#   .\deploy.ps1                  # Build + Upload
#   .\deploy.ps1 -SkipBuild       # Nur Upload
#
# Setup:
#   - PowerShell 7+
#   - SSH-Alias `conexa-hetzner` in $env:USERPROFILE\.ssh\config
#   - bun oder npm im PATH

param([switch]$SkipBuild)

$ErrorActionPreference = "Stop"
$Start = Get-Date

Set-Location $PSScriptRoot

Write-Host "============================================================"
Write-Host "  Landhotel Schend Deploy — $($Start.ToString('yyyy-MM-dd HH:mm:ss'))"
Write-Host "============================================================"

if (-not $SkipBuild) {
    Write-Host "[1/3] Vite-Build..."
    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun run build
    } else {
        npx vite build
    }
} else {
    Write-Host "[1/3] Build uebersprungen (-SkipBuild)"
}

if (-not (Test-Path "dist")) {
    Write-Error "dist/ existiert nicht. Build fehlgeschlagen oder vergessen?"
    exit 1
}

$Size = (Get-ChildItem dist -Recurse | Measure-Object Length -Sum).Sum / 1MB
$Files = (Get-ChildItem dist -Recurse -File | Measure-Object).Count
Write-Host ("  dist/: {0:N1} MB, {1} Files" -f $Size, $Files)

Write-Host "[2/3] Upload zu Hetzner (scp)..."
scp -q -r dist/* conexa-hetzner:/srv/conexa/sites/landhotel-schend/

Write-Host "[3/3] Verifikation..."
$RemoteSize = (ssh conexa-hetzner "du -sh /srv/conexa/sites/landhotel-schend/").Split()[0]
$Http = (Invoke-WebRequest -Uri "https://schend.conexadigital.eu" -TimeoutSec 10 -UseBasicParsing).StatusCode
$Title = (Invoke-WebRequest -Uri "https://schend.conexadigital.eu" -TimeoutSec 10 -UseBasicParsing).Content | Select-String -Pattern '<title[^>]*>([^<]+)</title>' | ForEach-Object { $_.Matches.Groups[1].Value }

$End = Get-Date
$Dur = [int]($End - $Start).TotalSeconds

Write-Host "============================================================"
Write-Host "  + Deploy fertig in ${Dur}s"
Write-Host "    Remote-Size: $RemoteSize"
Write-Host "    HTTP-Status: $Http"
Write-Host "    Title:       $($Title.Substring(0,[Math]::Min(60,$Title.Length)))"
Write-Host "    Live unter:  https://schend.conexadigital.eu"
Write-Host "============================================================"
