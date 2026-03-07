# Authentification Profile4 - ohada.save12@gmail.com

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Authentification Profile4 - ohada.save12@gmail.com" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$profileHome = Join-Path $env:USERPROFILE ".gemini-profile4"
$account = "ohada.save12@gmail.com"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Profile Home: $profileHome"
Write-Host "  Compte: $account"
Write-Host ""

# Créer le dossier
if (-not (Test-Path $profileHome)) {
    Write-Host "Creation du dossier..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileHome -Force | Out-Null
    Write-Host "Dossier cree" -ForegroundColor Green
} else {
    Write-Host "Dossier existe deja" -ForegroundColor Green
}
Write-Host ""

# Configurer l'environnement
$env:GEMINI_CLI_HOME = $profileHome

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Lancement de l'authentification" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "  1. Une fenetre de navigateur va s'ouvrir"
Write-Host "  2. Connectez-vous avec: $account"
Write-Host "  3. Autorisez l'acces a Gemini CLI"
Write-Host "  4. Attendez la confirmation"
Write-Host ""

Write-Host "Demarrage..." -ForegroundColor Yellow
Write-Host ""

# Lancer l'authentification
gemini auth login

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Verification du compte..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

gemini /model

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "1. Mettre a jour .env avec CLI_PROFILE4_ENABLED=true"
Write-Host "2. Mettre a jour MULTI_CLI_PROFILES=profile2,profile3,profile4"
Write-Host "3. Redemarrer le serveur: npm run multi-cli"
Write-Host "4. Tester: node scripts/test-profile4.js"
Write-Host ""
