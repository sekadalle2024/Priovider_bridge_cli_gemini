#!/usr/bin/env pwsh
# ============================================================================
# Script de démarrage rapide - Kiro CLI avec Claude Sonnet 4.5
# ============================================================================

$ErrorActionPreference = "Stop"

# Couleurs
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Info { Write-Host $args -ForegroundColor Cyan }

Clear-Host

Write-Host ""
Write-Host "========================================================================" -ForegroundColor White
Write-Host "  Kiro CLI avec Claude Sonnet 4.5 - Démarrage" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor White
Write-Host ""

# Vérifier Node.js
Write-Info "Vérification de Node.js..."
try {
    $nodeVersion = node --version
    Write-Success "[OK] Node.js est installé: $nodeVersion"
} catch {
    Write-Error "[ERREUR] Node.js n'est pas installé ou n'est pas dans le PATH"
    Write-Host ""
    Write-Host "Veuillez installer Node.js depuis https://nodejs.org/"
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}
Write-Host ""

# Vérifier Kiro CLI
Write-Info "Vérification de Kiro CLI..."
try {
    $kiroVersion = kiro --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Success "[OK] Kiro CLI est installé: $kiroVersion"
} catch {
    Write-Warning "[ATTENTION] Kiro CLI n'est pas installé"
    Write-Host ""
    Write-Info "Installation de Kiro CLI..."
    
    try {
        npm install -g @kirodotdev/cli
        if ($LASTEXITCODE -ne 0) { throw }
        Write-Success "[OK] Kiro CLI installé avec succès"
    } catch {
        Write-Error "[ERREUR] Échec de l'installation de Kiro CLI"
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}
Write-Host ""

# Vérifier l'authentification
Write-Info "Vérification de l'authentification Kiro..."
try {
    $authStatus = kiro auth status 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Success "[OK] Authentification valide"
} catch {
    Write-Warning "[ATTENTION] Vous n'êtes pas authentifié"
    Write-Host ""
    Write-Info "Lancement de l'authentification..."
    Write-Host "Suivez les instructions dans votre navigateur"
    Write-Host ""
    
    try {
        kiro auth login
        if ($LASTEXITCODE -ne 0) { throw }
        Write-Success "[OK] Authentification réussie"
    } catch {
        Write-Error "[ERREUR] Échec de l'authentification"
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}
Write-Host ""

# Vérifier le fichier .env
Write-Info "Vérification du fichier .env..."
if (-not (Test-Path ".env")) {
    Write-Warning "[ATTENTION] Fichier .env non trouvé"
    Write-Host ""
    
    if (Test-Path ".env.example") {
        Write-Info "Copie de .env.example vers .env..."
        Copy-Item ".env.example" ".env"
        Write-Success "[OK] Fichier .env créé"
        Write-Host ""
        Write-Warning "IMPORTANT: Vérifiez la configuration dans .env"
        Write-Host ""
    } else {
        Write-Error "[ERREUR] Fichier .env.example non trouvé"
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
} else {
    Write-Success "[OK] Fichier .env trouvé"
}
Write-Host ""

# Vérifier node_modules
Write-Info "Vérification des dépendances..."
if (-not (Test-Path "node_modules")) {
    Write-Warning "[ATTENTION] node_modules non trouvé"
    Write-Host ""
    Write-Info "Installation des dépendances..."
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) { throw }
        Write-Success "[OK] Dépendances installées"
    } catch {
        Write-Error "[ERREUR] Échec de l'installation des dépendances"
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
} else {
    Write-Success "[OK] Dépendances trouvées"
}
Write-Host ""

# Créer le dossier workspace
Write-Info "Vérification du dossier workspace..."
if (-not (Test-Path "workspace")) {
    Write-Info "Création du dossier workspace..."
    New-Item -ItemType Directory -Path "workspace" | Out-Null
    Write-Success "[OK] Dossier workspace créé"
} else {
    Write-Success "[OK] Dossier workspace trouvé"
}
Write-Host ""

# Afficher les informations
Write-Host "========================================================================" -ForegroundColor White
Write-Host "  Démarrage du serveur Kiro CLI" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor White
Write-Host ""
Write-Info "Base URL: http://localhost:25810/v1/kiro-cli"
Write-Host ""
Write-Host "Endpoints disponibles:"
Write-Host "  - Chat: http://localhost:25810/v1/kiro-cli/chat/completions"
Write-Host "  - Models: http://localhost:25810/v1/kiro-cli/models"
Write-Host "  - Status: http://localhost:25810/api/kiro-cli/status"
Write-Host ""
Write-Warning "Appuyez sur Ctrl+C pour arrêter le serveur"
Write-Host ""
Write-Host "========================================================================" -ForegroundColor White
Write-Host ""

# Démarrer le serveur
try {
    npm run start:assistants
} catch {
    Write-Error "[ERREUR] Le serveur s'est arrêté de manière inattendue"
    Write-Host ""
    Write-Host "Vérifiez les logs pour plus d'informations"
}

# Si le serveur s'arrête
Write-Host ""
Write-Host "========================================================================" -ForegroundColor White
Write-Host "  Serveur arrêté" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
