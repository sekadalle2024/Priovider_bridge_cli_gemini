# Script de déploiement automatique sur Render via CLI (Windows PowerShell)
# Usage: .\scripts\deploy-render.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Déploiement du serveur des assistants sur Render" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Vérifier si Render CLI est installé
if (-not (Get-Command render -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Render CLI n'est pas installé" -ForegroundColor Red
    Write-Host "📦 Installation de Render CLI..." -ForegroundColor Yellow
    npm install -g @render/cli
}

Write-Host "✅ Render CLI installé" -ForegroundColor Green

# Vérifier l'authentification
Write-Host "🔐 Vérification de l'authentification..." -ForegroundColor Cyan
try {
    render whoami | Out-Null
    Write-Host "✅ Authentifié sur Render" -ForegroundColor Green
} catch {
    Write-Host "❌ Non authentifié" -ForegroundColor Red
    Write-Host "🔑 Connexion à Render..." -ForegroundColor Yellow
    render login
}

# Obtenir les credentials OAuth Gemini
Write-Host ""
Write-Host "🔐 Configuration OAuth Gemini" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$geminiCredsPath = "$env:USERPROFILE\.gemini\oauth_creds.json"

if (-not (Test-Path $geminiCredsPath)) {
    Write-Host "❌ Credentials OAuth non trouvés" -ForegroundColor Red
    Write-Host "📝 Veuillez d'abord authentifier Gemini CLI:" -ForegroundColor Yellow
    Write-Host "   gemini auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Credentials OAuth trouvés" -ForegroundColor Green

# Lire et parser le JSON
$creds = Get-Content $geminiCredsPath | ConvertFrom-Json
$accessToken = $creds.access_token
$refreshToken = $creds.refresh_token

if (-not $accessToken -or -not $refreshToken) {
    Write-Host "❌ Impossible d'extraire les tokens OAuth" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tokens OAuth extraits" -ForegroundColor Green

# Créer le service
Write-Host ""
Write-Host "🏗️  Création du service sur Render" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Vérifier si le service existe déjà
$serviceExists = render services list | Select-String "aionui-assistants"

if ($serviceExists) {
    Write-Host "⚠️  Le service 'aionui-assistants' existe déjà" -ForegroundColor Yellow
    Write-Host "📝 Mise à jour du service..." -ForegroundColor Yellow
    
    # Mettre à jour les variables d'environnement
    render env set -s aionui-assistants `
        GEMINI_OAUTH_ACCESS_TOKEN="$accessToken" `
        GEMINI_OAUTH_REFRESH_TOKEN="$refreshToken"
    
    Write-Host "✅ Variables d'environnement mises à jour" -ForegroundColor Green
    
    # Déclencher un nouveau déploiement
    Write-Host "🚀 Déclenchement d'un nouveau déploiement..." -ForegroundColor Cyan
    render deploy -s aionui-assistants
    
} else {
    Write-Host "📝 Création d'un nouveau service..." -ForegroundColor Yellow
    
    # Créer le service via Blueprint
    if (Test-Path "render-native.yaml") {
        Write-Host "✅ Fichier render-native.yaml trouvé" -ForegroundColor Green
        render blueprint launch
        
        # Attendre que le service soit créé
        Write-Host "⏳ Attente de la création du service..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Configurer les secrets OAuth
        Write-Host "🔐 Configuration des secrets OAuth..." -ForegroundColor Cyan
        render env set -s aionui-assistants `
            GEMINI_OAUTH_ACCESS_TOKEN="$accessToken" `
            GEMINI_OAUTH_REFRESH_TOKEN="$refreshToken"
        
        Write-Host "✅ Service créé et configuré" -ForegroundColor Green
    } else {
        Write-Host "❌ Fichier render-native.yaml non trouvé" -ForegroundColor Red
        Write-Host "📝 Veuillez créer render-native.yaml d'abord" -ForegroundColor Yellow
        exit 1
    }
}

# Afficher les informations du service
Write-Host ""
Write-Host "📊 Informations du service" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
render services list | Select-String "aionui-assistants"

# Afficher les commandes utiles
Write-Host ""
Write-Host "📋 Commandes utiles" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "Pour voir les logs en temps réel:" -ForegroundColor Yellow
Write-Host "  render logs -s aionui-assistants -f" -ForegroundColor White
Write-Host ""
Write-Host "Pour voir le statut:" -ForegroundColor Yellow
Write-Host "  render services list" -ForegroundColor White
Write-Host ""
Write-Host "Pour ouvrir le dashboard:" -ForegroundColor Yellow
Write-Host "  render open -s aionui-assistants" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "=======================" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Votre serveur sera disponible à:" -ForegroundColor Cyan
Write-Host "   https://aionui-assistants.onrender.com" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Endpoints:" -ForegroundColor Cyan
Write-Host "   Health:  https://aionui-assistants.onrender.com/health" -ForegroundColor White
Write-Host "   API:     https://aionui-assistants.onrender.com/api/v1" -ForegroundColor White
Write-Host "   Swagger: https://aionui-assistants.onrender.com/api-docs" -ForegroundColor White
