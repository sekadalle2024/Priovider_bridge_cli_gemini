#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Authentification du Profile4 avec ohada.save12@gmail.com
.DESCRIPTION
    Configure et authentifie le compte ohada.save12@gmail.com pour Gemini CLI
#>

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🔐 Authentification Profile4 - ohada.save12@gmail.com" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# Configuration
$profileHome = "$env:USERPROFILE\.gemini-profile4"
$account = "ohada.save12@gmail.com"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Profile Home: $profileHome"
Write-Host "   Compte: $account`n"

# Créer le dossier si nécessaire
if (-not (Test-Path $profileHome)) {
    Write-Host "📁 Création du dossier $profileHome..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileHome -Force | Out-Null
    Write-Host "✅ Dossier créé`n" -ForegroundColor Green
} else {
    Write-Host "✅ Dossier existe déjà`n" -ForegroundColor Green
}

# Configurer l'environnement
$env:GEMINI_CLI_HOME = $profileHome

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🚀 Lancement de l'authentification Gemini CLI" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host "   1. Une fenêtre de navigateur va s'ouvrir"
Write-Host "   2. Connectez-vous avec: $account"
Write-Host "   3. Autorisez l'accès à Gemini CLI"
Write-Host "   4. Attendez la confirmation`n"

Write-Host "⏳ Démarrage de l'authentification...`n" -ForegroundColor Yellow

# Lancer l'authentification
& gemini auth login

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host "✅ Authentification réussie!" -ForegroundColor Green
    Write-Host "============================================================`n" -ForegroundColor Green
    
    Write-Host "📊 Vérification du compte..." -ForegroundColor Yellow
    & gemini /model
    
    Write-Host "`n============================================================" -ForegroundColor Cyan
    Write-Host "🎯 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "1. Mettre à jour .env avec CLI_PROFILE4_ENABLED=true"
    Write-Host "2. Mettre à jour MULTI_CLI_PROFILES=profile2,profile3,profile4"
    Write-Host "3. Redémarrer le serveur: npm run multi-cli"
    Write-Host "4. Tester: node scripts/test-profile4.js`n"
    
} else {
    Write-Host "`n❌ Erreur lors de l'authentification (code: $LASTEXITCODE)" -ForegroundColor Red
    Write-Host "Vérifiez que vous utilisez le bon compte: $account`n" -ForegroundColor Yellow
}

Write-Host "============================================================`n" -ForegroundColor Cyan
