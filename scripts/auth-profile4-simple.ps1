# Script d'authentification pour Profile4 (ohada.save6@gmail.com)

Write-Host "Authentification Profile4 - ohada.save6@gmail.com" -ForegroundColor Cyan
Write-Host ""

# Definir le repertoire du profile4
$profileHome = "$HOME\.gemini-profile4"
$env:GEMINI_CLI_HOME = $profileHome

Write-Host "Repertoire du profil: $profileHome" -ForegroundColor Yellow

# Verifier si le repertoire existe
if (Test-Path $profileHome) {
    Write-Host "Repertoire profile4 existe" -ForegroundColor Green
} else {
    Write-Host "Creation du repertoire profile4..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileHome -Force | Out-Null
    Write-Host "Repertoire cree" -ForegroundColor Green
}

Write-Host ""
Write-Host "Lancement de l'authentification Gemini CLI..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "  1. Une fenetre de navigateur va s'ouvrir" -ForegroundColor White
Write-Host "  2. Connectez-vous avec: ohada.save6@gmail.com" -ForegroundColor White
Write-Host "  3. Autorisez l'acces a Gemini CLI" -ForegroundColor White
Write-Host "  4. Attendez le message de confirmation" -ForegroundColor White
Write-Host ""

# Lancer l'authentification
gemini auth login

Write-Host ""
Write-Host "Verification du fichier de credentials..." -ForegroundColor Cyan

# Verifier que le fichier de credentials existe
$credsFile = "$profileHome\.gemini\oauth_creds.json"
if (Test-Path $credsFile) {
    Write-Host "Fichier de credentials cree: $credsFile" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Test du profile4..." -ForegroundColor Cyan
    Write-Host ""
    
    # Tester le profil
    gemini -m gemini-2.5-flash --prompt "Test du profile4 - reponds juste OK"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Test reussi!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Profile4 est pret!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Prochaines etapes:" -ForegroundColor Yellow
        Write-Host "  1. Redemarrer le serveur: npm run multi-cli" -ForegroundColor White
        Write-Host "  2. Tester l'endpoint profile4" -ForegroundColor White
        Write-Host "  3. Verifier Swagger UI: http://localhost:25815/api-docs" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "Test echoue" -ForegroundColor Red
        Write-Host "Verifiez l'authentification" -ForegroundColor White
    }
} else {
    Write-Host "Fichier de credentials non trouve" -ForegroundColor Yellow
    Write-Host "Attendu: $credsFile" -ForegroundColor White
    Write-Host ""
    Write-Host "Reessayez l'authentification:" -ForegroundColor Yellow
    Write-Host "  gemini auth login" -ForegroundColor White
}

Write-Host ""
