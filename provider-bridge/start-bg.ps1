# Provider Bridge - Background Launcher
# Usage: powershell -ExecutionPolicy Bypass -File start-bg.ps1

Set-StrictMode -Off
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Log  = Join-Path $Root "server.log"
$PidFile = Join-Path $Root "server.pid"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Provider Bridge - Lancement en arriere-plan" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Kill anything already on port 25809
$old = netstat -ano 2>$null | Select-String ":25809 " | Select-String "LISTENING"
if ($old) {
    $oldPid = ($old.ToString().Trim() -split "\s+")[-1]
    Write-Host "  Port 25809 occupe (PID $oldPid) - arret..." -ForegroundColor Yellow
    taskkill /F /PID $oldPid /T 2>$null | Out-Null
    Start-Sleep -Seconds 2
}

# Clear old log
if (Test-Path $Log) { Clear-Content $Log }

# Start server as hidden background process
$proc = Start-Process `
    -FilePath "cmd" `
    -ArgumentList "/c npx tsx src/server.ts >> `"$Log`" 2>&1" `
    -WorkingDirectory $Root `
    -WindowStyle Hidden `
    -PassThru

$proc.Id | Out-File -FilePath $PidFile -Encoding ascii -NoNewline
Write-Host "  Serveur lance (PID $($proc.Id))" -ForegroundColor Green
Write-Host "  Logs : $Log" -ForegroundColor Gray
Write-Host ""

# Wait for server to be ready (up to 25s)
Write-Host "  Attente du serveur " -NoNewline
$ok = $false
for ($i = 0; $i -lt 25; $i++) {
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline
    try {
        $h = Invoke-RestMethod "http://localhost:25809/health" -TimeoutSec 2 -ErrorAction Stop
        if ($h.status -eq "ok") { $ok = $true; break }
    } catch {}
}
Write-Host ""
Write-Host ""

if ($ok) {
    $v = Invoke-RestMethod "http://localhost:25809/version" -ErrorAction SilentlyContinue
    $s = Invoke-RestMethod "http://localhost:25809/api/providers/gemini_api_key_rotative/stats" -ErrorAction SilentlyContinue

    Write-Host "  SERVEUR OPERATIONNEL" -ForegroundColor Green
    Write-Host ""
    Write-Host "  URL      : http://localhost:25809" -ForegroundColor White
    Write-Host "  Swagger  : http://localhost:25809/docs" -ForegroundColor White
    Write-Host "  Health   : http://localhost:25809/health" -ForegroundColor White
    Write-Host "  n8n Base : http://localhost:25809/v1" -ForegroundColor Cyan
    Write-Host ""
    if ($v) {
        Write-Host "  Version  : $($v.version)" -ForegroundColor Gray
    }
    if ($s) {
        Write-Host "  Cles     : $($s.keysEnabled)/$($s.keysConfigured) actives" -ForegroundColor Gray
        Write-Host "  Capacite : $($s.capacityPerMinute) req/min" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "  Admin dashboard : http://localhost:25809" -ForegroundColor Yellow
    Write-Host "  Login           : admin / admin123" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Pour arreter    : powershell -ExecutionPolicy Bypass -File stop-bg.ps1" -ForegroundColor DarkYellow
    Write-Host "  Pour les logs   : Get-Content server.log -Tail 50 -Wait" -ForegroundColor DarkYellow
} else {
    Write-Host "  ERREUR : le serveur ne repond pas apres 25 secondes." -ForegroundColor Red
    Write-Host "  Verifiez les logs : $Log" -ForegroundColor Red
    Write-Host ""
    if (Test-Path $Log) {
        Write-Host "--- Derniers logs ---" -ForegroundColor Gray
        Get-Content $Log -Tail 30
        Write-Host "---------------------" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
