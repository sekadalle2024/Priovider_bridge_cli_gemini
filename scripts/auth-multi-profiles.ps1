# Script d'authentification des profils Gemini CLI
# Usage: .\scripts\auth-multi-profiles.ps1

Write-Host "🔐 Authentification Multi-Profils Gemini CLI" -ForegroundColor Cyan
Write-Host ("=" * 70)
Write-Host ""

# Liste des comptes à configurer
$accounts = @(
    @{
        id = "profile1"
        email = "ohada.finance@gmail.com"
        home = "$HOME\.gemini"
        description = "Compte principal (déjà configuré)"
    },
    @{
        id = "profile2"
        email = "ohada.save@gmail.com"
        home = "$HOME\.gemini-profile2"
        description = "Compte secondaire"
    },
    @{
        id = "profile3"
        email = "ohada.save2@gmail.com"
        home = "$HOME\.gemini-profile3"
        description = "Compte tertiaire"
    }
)

Write-Host "📋 Comptes à configurer:" -ForegroundColor Yellow
Write-Host ""
for ($i = 0; $i -lt $accounts.Count; $i++) {
    $account = $accounts[$i]
    Write-Host "  $($i + 1). $($account.id) - $($account.email)"
    Write-Host "     $($account.description)"
    Write-Host ""
}

Write-Host ("=" * 70)
Write-Host ""

# Demander quels profils configurer
Write-Host "Quels profils voulez-vous configurer?" -ForegroundColor Cyan
Write-Host "  [1] Profil 1 uniquement (ohada.finance@gmail.com)"
Write-Host "  [2] Profils 1 et 2 (ohada.finance + ohada.save)"
Write-Host "  [3] Tous les profils (ohada.finance + ohada.save + ohada.save2)"
Write-Host "  [C] Configurer manuellement"
Write-Host ""

$choice = Read-Host "Votre choix (1/2/3/C)"

$profilesToAuth = @()

switch ($choice.ToUpper()) {
    "1" {
        $profilesToAuth = @($accounts[0])
    }
    "2" {
        $profilesToAuth = @($accounts[0], $accounts[1])
    }
    "3" {
        $profilesToAuth = $accounts
    }
    "C" {
        Write-Host "`nSélectionnez les profils à configurer (séparés par des virgules, ex: 1,2,3):"
        $selection = Read-Host "Profils"
        $indices = $selection.Split(',') | ForEach-Object { [int]$_.Trim() - 1 }
        $profilesToAuth = $indices | ForEach-Object { $accounts[$_] }
    }
    default {
        Write-Host "❌ Choix invalide" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host ("=" * 70)
Write-Host "🚀 Démarrage de l'authentification..." -ForegroundColor Green
Write-Host ("=" * 70)
Write-Host ""

$results = @()

foreach ($account in $profilesToAuth) {
    Write-Host ""
    Write-Host ("─" * 70) -ForegroundColor DarkGray
    Write-Host "📧 Profil: $($account.id)" -ForegroundColor Cyan
    Write-Host "   Email: $($account.email)" -ForegroundColor White
    Write-Host "   Home: $($account.home)" -ForegroundColor Gray
    Write-Host ("─" * 70) -ForegroundColor DarkGray
    Write-Host ""
    
    # Vérifier si déjà authentifié
    $credsFile = Join-Path $account.home "oauth_creds.json"
    if (Test-Path $credsFile) {
        Write-Host "ℹ️  Ce profil semble déjà authentifié." -ForegroundColor Yellow
        Write-Host "   Fichier trouvé: $credsFile"
        Write-Host ""
        $reauth = Read-Host "Voulez-vous réauthentifier? (O/N)"
        if ($reauth.ToUpper() -ne "O") {
            Write-Host "⏭️  Profil ignoré" -ForegroundColor Gray
            $results += @{
                profile = $account.id
                email = $account.email
                status = "skipped"
                message = "Déjà authentifié"
            }
            continue
        }
    }
    
    Write-Host "🔐 Authentification en cours..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Red
    Write-Host "  1. Une fenêtre de navigateur va s'ouvrir"
    Write-Host "  2. Connectez-vous avec: $($account.email)" -ForegroundColor Cyan
    Write-Host "  3. Autorisez l'accès à Gemini CLI"
    Write-Host ""
    
    $continue = Read-Host "Prêt à continuer? (O/N)"
    if ($continue.ToUpper() -ne "O") {
        Write-Host "⏭️  Profil ignoré" -ForegroundColor Gray
        $results += @{
            profile = $account.id
            email = $account.email
            status = "skipped"
            message = "Ignoré par l'utilisateur"
        }
        continue
    }
    
    Write-Host ""
    Write-Host "⏳ Lancement de gemini auth login..." -ForegroundColor Yellow
    Write-Host ""
    
    # Définir la variable d'environnement
    $env:GEMINI_CLI_HOME = $account.home
    
    # Créer le répertoire si nécessaire
    if (-not (Test-Path $account.home)) {
        New-Item -ItemType Directory -Path $account.home -Force | Out-Null
        Write-Host "✅ Répertoire créé: $($account.home)" -ForegroundColor Green
    }
    
    # Lancer l'authentification
    try {
        Write-Host "Commande: gemini auth login" -ForegroundColor Gray
        Write-Host ("─" * 70) -ForegroundColor DarkGray
        
        gemini auth login
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host ("─" * 70) -ForegroundColor DarkGray
            Write-Host "✅ Authentification réussie pour $($account.id)!" -ForegroundColor Green
            
            # Vérifier que le fichier de credentials existe
            if (Test-Path $credsFile) {
                Write-Host "✅ Fichier de credentials créé: $credsFile" -ForegroundColor Green
                
                $results += @{
                    profile = $account.id
                    email = $account.email
                    status = "success"
                    home = $account.home
                    credsFile = $credsFile
                }
            } else {
                Write-Host "⚠️  Authentification réussie mais fichier de credentials non trouvé" -ForegroundColor Yellow
                $results += @{
                    profile = $account.id
                    email = $account.email
                    status = "warning"
                    message = "Credentials non trouvés"
                }
            }
        } else {
            Write-Host ""
            Write-Host "❌ Échec de l'authentification pour $($account.id)" -ForegroundColor Red
            $results += @{
                profile = $account.id
                email = $account.email
                status = "failed"
                message = "Échec de gemini auth login"
            }
        }
    } catch {
        Write-Host ""
        Write-Host "❌ Erreur lors de l'authentification: $_" -ForegroundColor Red
        $results += @{
            profile = $account.id
            email = $account.email
            status = "error"
            message = $_.Exception.Message
        }
    }
    
    Write-Host ""
    Start-Sleep -Seconds 2
}

# Afficher le résumé
Write-Host ""
Write-Host ("=" * 70)
Write-Host "📊 RÉSUMÉ DE L'AUTHENTIFICATION" -ForegroundColor Cyan
Write-Host ("=" * 70)
Write-Host ""

$successCount = ($results | Where-Object { $_.status -eq "success" }).Count
$failedCount = ($results | Where-Object { $_.status -eq "failed" -or $_.status -eq "error" }).Count
$skippedCount = ($results | Where-Object { $_.status -eq "skipped" }).Count

Write-Host "Profils authentifiés avec succès: $successCount" -ForegroundColor Green
Write-Host "Profils échoués: $failedCount" -ForegroundColor Red
Write-Host "Profils ignorés: $skippedCount" -ForegroundColor Gray
Write-Host ""

foreach ($result in $results) {
    $icon = switch ($result.status) {
        "success" { "✅"; $color = "Green" }
        "failed" { "❌"; $color = "Red" }
        "error" { "❌"; $color = "Red" }
        "skipped" { "⏭️ "; $color = "Gray" }
        "warning" { "⚠️ "; $color = "Yellow" }
        default { "❓"; $color = "White" }
    }
    
    Write-Host "$icon $($result.profile) - $($result.email)" -ForegroundColor $color
    if ($result.message) {
        Write-Host "   $($result.message)" -ForegroundColor Gray
    }
    if ($result.credsFile) {
        Write-Host "   Credentials: $($result.credsFile)" -ForegroundColor DarkGray
    }
}

# Générer la configuration .env
if ($successCount -gt 0) {
    Write-Host ""
    Write-Host ("=" * 70)
    Write-Host "📝 Génération de la configuration .env..." -ForegroundColor Cyan
    Write-Host ("=" * 70)
    Write-Host ""
    
    $successProfiles = $results | Where-Object { $_.status -eq "success" }
    $profileIds = ($successProfiles | ForEach-Object { $_.profile }) -join ','
    
    $envConfig = @"

# =============================================================================
# Configuration Multi-CLI Gemini (Mise à jour automatique)
# Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# =============================================================================

# Liste des profils authentifiés
MULTI_CLI_PROFILES=$profileIds

"@
    
    $port = 25811
    foreach ($result in $successProfiles) {
        $profileUpper = $result.profile.ToUpper()
        $envConfig += @"

# $($result.profile) - $($result.email)
CLI_${profileUpper}_HOME=$($result.home)
CLI_${profileUpper}_PORT=$port
CLI_${profileUpper}_ACCOUNT=$($result.email)
CLI_${profileUpper}_ENABLED=true

"@
        $port++
    }
    
    # Sauvegarder dans un fichier
    $envFile = ".env.multi-cli-auth"
    $envConfig | Out-File -FilePath $envFile -Encoding UTF8
    
    Write-Host "✅ Configuration sauvegardée dans: $envFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Pour appliquer la configuration:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ouvrir le fichier .env" -ForegroundColor Cyan
    Write-Host "2. Copier le contenu de $envFile" -ForegroundColor Cyan
    Write-Host "3. Coller dans .env (remplacer la section MULTI_CLI)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OU utiliser cette commande:" -ForegroundColor Yellow
    Write-Host "   Get-Content $envFile | Add-Content .env" -ForegroundColor Cyan
}

Write-Host ""
Write-Host ("=" * 70)
Write-Host "🎉 Authentification terminée!" -ForegroundColor Green
Write-Host ("=" * 70)
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "📋 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Mettre à jour .env avec la nouvelle configuration"
    Write-Host "2. Redémarrer le serveur Multi-CLI:"
    Write-Host "   npm run multi-cli" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Tester les profils:"
    Write-Host "   npm run test:multi-cli" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "✅ Script terminé" -ForegroundColor Green
