# Script pour mettre à jour le port 25809 vers 25810 dans tous les fichiers de documentation

$oldPort = "25809"
$newPort = "25810"
$excludePaths = @("node_modules", "dist", ".git", "provider-bridge")

Write-Host ""
Write-Host "Mise a jour du port $oldPort vers $newPort dans les fichiers de documentation..." -ForegroundColor Cyan

# Trouver tous les fichiers .md
$files = Get-ChildItem -Path . -Filter "*.md" -Recurse | Where-Object {
    $path = $_.FullName
    $exclude = $false
    foreach ($excludePath in $excludePaths) {
        if ($path -like "*$excludePath*") {
            $exclude = $true
            break
        }
    }
    !$exclude
}

$updatedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if ($content -and $content -match $oldPort) {
        $newContent = $content -replace $oldPort, $newPort
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Mis a jour: $($file.Name)" -ForegroundColor Green
        $updatedCount++
    }
}

Write-Host ""
Write-Host "Resume:" -ForegroundColor Cyan
Write-Host "   Fichiers mis à jour: $updatedCount" -ForegroundColor Green
Write-Host "   Port ancien: $oldPort" -ForegroundColor Yellow
Write-Host "   Port nouveau: $newPort" -ForegroundColor Green
Write-Host ""
Write-Host "Mise a jour terminee!" -ForegroundColor Green
