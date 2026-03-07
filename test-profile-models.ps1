Write-Host "Test des endpoints /models pour chaque profil" -ForegroundColor Cyan
Write-Host ""

# Test Load Balancer
Write-Host "1. Load Balancer: /api/v1/cli/models" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:25815/api/v1/cli/models" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode) - Modèles: $($data.data.Count)" -ForegroundColor Green
} catch {
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Profile2
Write-Host "2. Profile2: /api/v1/cli/profile2/models" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:25815/api/v1/cli/profile2/models" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode) - Modèles: $($data.data.Count)" -ForegroundColor Green
    Write-Host "   Modèles disponibles:" -ForegroundColor Cyan
    $data.data | ForEach-Object { Write-Host "     - $($_.id)" -ForegroundColor White }
} catch {
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Profile3
Write-Host "3. Profile3: /api/v1/cli/profile3/models" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:25815/api/v1/cli/profile3/models" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode) - Modèles: $($data.data.Count)" -ForegroundColor Green
    Write-Host "   Modèles disponibles:" -ForegroundColor Cyan
    $data.data | ForEach-Object { Write-Host "     - $($_.id)" -ForegroundColor White }
} catch {
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test terminé!" -ForegroundColor Green
