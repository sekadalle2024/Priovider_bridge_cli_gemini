# Provider Bridge — Stop Background Server
# Usage: powershell -ExecutionPolicy Bypass -File stop-bg.ps1

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PidFile = Join-Path $Root "server.pid"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Provider Bridge - Arret du serveur" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$stopped = $false

# Method 1: use PID file
if (Test-Path $PidFile) {
    $savedPid = Get-Content $PidFile -Raw
    $savedPid = $savedPid.Trim()
    Write-Host "  PID enregistre : $savedPid" -ForegroundColor Gray
    try {
        $proc = Get-Process -Id $savedPid -ErrorAction Stop
        Write-Host "  Arret du processus $savedPid ($($proc.ProcessName))..." -ForegroundColor Yellow
        taskkill /F /T /PID $savedPid 2>$null | Out-Null
        Start-Sleep 1
        $stopped = $true
        Write-Host "  Processus arrete." -ForegroundColor Green
    } catch {
        Write-Host "  PID $savedPid introuvable (deja arrete?)." -ForegroundColor Gray
        $stopped = $true
    }
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "  Aucun fichier server.pid trouve." -ForegroundColor Yellow
}

# Method 2: kill by port 25809
$portProcs = netstat -ano | Select-String ":25809 " | Select-String "LISTENING"
if ($portProcs) {
    foreach ($line in $portProcs) {
        $parts = ($line.ToString().Trim() -split "\s+")
        $portPid = $parts[-1]
        if ($portPid -match "^\d+$") {
            Write-Host "  Processus sur port 25809 (PID $portPid) — arret force..." -ForegroundColor Yellow
            taskkill /F /T /PID $portPid 2>$null | Out-Null
            $stopped = $true
        }
    }
    Start-Sleep 1
}

# Method 3: kill any tsx/node running server.ts
$nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
foreach ($p in $nodeProcs) {
    try {
        $cmd = (Get-CimInstance Win32_Process -Filter "ProcessId=$($p.Id)" -ErrorAction SilentlyContinue).CommandLine
        if ($cmd -and ($cmd -match "server\.ts" -or $cmd -match "provider-bridge")) {
            Write-Host "  Node process detecte (PID $($p.Id)) — arret..." -ForegroundColor Yellow
            taskkill /F /T /PID $p.Id 2>$null | Out-Null
            $stopped = $true
        }
    } catch {}
}

# Verify port is free
Start-Sleep 1
$stillRunning = netstat -ano | Select-String ":25809 " | Select-String "LISTENING"
if ($stillRunning) {
    Write-Host ""
    Write-Host "  ATTENTION : port 25809 toujours occupe." -ForegroundColor Red
    Write-Host "  Relancez le script ou redemarrez votre session." -ForegroundColor Red
} else {
    Write-Host ""
    if ($stopped) {
        Write-Host "  Serveur arrete avec succes." -ForegroundColor Green
    } else {
        Write-Host "  Aucun serveur en cours d'execution sur le port 25809." -ForegroundColor Gray
    }
    Write-Host "  Port 25809 : libre" -ForegroundColor Green
}

Write-Host ""
Write-Host "  Pour relancer : powershell -ExecutionPolicy Bypass -File start-bg.ps1" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
