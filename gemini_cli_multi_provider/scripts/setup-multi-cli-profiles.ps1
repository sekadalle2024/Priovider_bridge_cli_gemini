# Script de configuration des profils Gemini CLI
# Usage: .\scripts\setup-multi-cli-profiles.ps1

Write-Host "🔧 Configuration des Profils Gemini CLI" -ForegroundColor Cyan
Write-Host "=" * 60

# Demander le nombre de profils
$numProfiles = Read-Host "`nCombien de comptes Google voulez-vous configurer? (1-10)"
$numProfiles = [int]$numProfiles

if ($numProfiles -lt 1 -or $numProfiles -gt 10) {
    Write-Host "❌ Nombre invalide. Utilisez entre 1 et 10." -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Configuration de $numProfiles profil(s)..." -ForegroundColor Yellow

# Tableau pour stocker les configurations
$profiles = @()

for ($i = 1; $i -le $numProfiles; $i++) {
    Write-Host "`n" + ("-" * 60)
    Write-Host "Profil $i / $numProfiles" -ForegroundColor Cyan
    Write-Host ("-" * 60)
    
    $profileId = "profile$i"
    $email = Read-Host "Email du compte Google"
    
    # Créer le répertoire du profil
    $profileHome = "$HOME\.gemini-$profileId"
    
    Write-Host "`n🔐 Authentification pour $email..." -ForegroundColor Yellow
    Write-Host "Une fenêtre de navigateur va s'ouvrir."
    Write-Host "Connectez-vous avec: $email"
    Write-Host ""
    
    # Définir la variable d'environnement et lancer l'authentification
    $env:GEMINI_CLI_HOME = $profileHome
    
    Write-Host "Exécution: gemini auth login" -ForegroundColor Gray
    gemini auth login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Profil $profileId configuré avec succès!" -ForegroundColor Green
        
        $profiles += @{
            id = $profileId
            email = $email
            home = $profileHome
            port = 25810 + $i
        }
    } else {
        Write-Host "❌ Échec de la configuration du profil $profileId" -ForegroundColor Red
    }
}

# Générer la configuration .env
Write-Host "`n" + ("=" * 60)
Write-Host "📝 Génération de la configuration .env..." -ForegroundColor Cyan
Write-Host ("=" * 60)

$envContent = @"

# =============================================================================
# Configuration Multi-CLI Gemini (Généré automatiquement)
# Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# =============================================================================

# Activer le mode Multi-CLI
MULTI_CLI_ENABLED=true

# Liste des profils (séparés par des virgules)
MULTI_CLI_PROFILES=$($profiles.id -join ',')

# Stratégie de load balancing
# Options: round-robin, least-loaded, random, weighted
CLI_LOAD_BALANCER_STRATEGY=round-robin

"@

foreach ($profile in $profiles) {
    $envContent += @"

# Profil: $($profile.id)
CLI_$($profile.id.ToUpper())_HOME=$($profile.home)
CLI_$($profile.id.ToUpper())_PORT=$($profile.port)
CLI_$($profile.id.ToUpper())_ACCOUNT=$($profile.email)
CLI_$($profile.id.ToUpper())_ENABLED=true

"@
}

# Sauvegarder dans un fichier temporaire
$envFile = ".env.multi-cli"
$envContent | Out-File -FilePath $envFile -Encoding UTF8

Write-Host "`n✅ Configuration sauvegardée dans: $envFile" -ForegroundColor Green

# Afficher un résumé
Write-Host "`n" + ("=" * 60)
Write-Host "📊 RÉSUMÉ DE LA CONFIGURATION" -ForegroundColor Cyan
Write-Host ("=" * 60)

Write-Host "`nProfils configurés: $($profiles.Count)"
foreach ($profile in $profiles) {
    Write-Host "  ✅ $($profile.id): $($profile.email) (port $($profile.port))"
}

Write-Host "`n📋 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Copier la configuration dans .env:"
Write-Host "   Get-Content .env.multi-cli | Add-Content .env" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Compiler le projet:"
Write-Host "   npm run build" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Démarrer le serveur Multi-CLI:"
Write-Host "   npm run multi-cli" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Tester les endpoints:"
Write-Host "   curl http://localhost:25810/api/v1/cli/profiles" -ForegroundColor Cyan
Write-Host ""

Write-Host ("=" * 60)
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ("=" * 60)
