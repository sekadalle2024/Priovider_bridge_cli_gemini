# Script d'authentification pour Profile4 (ohada.save6@gmail.com)
# Usage: .\scripts\auth-profile4.ps1

Write-Host "🔐 Authentification Profile4 - ohada.save6@gmail.com" -ForegroundColor Cyan
Write-Host ""

# Définir le répertoire du profile4
$profileHome = "$HOME\.gemini-profile4"
$env:GEMINI_CLI_HOME = $profileHome

Write-Host "📁 Répertoire du profil: $profileHome" -ForegroundColor Yellow

# Vérifier si le répertoire existe
if (Test-Path $profileHome) {
    Write-Host "✅ Répertoire profile4 existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  Répertoire profile4 n'existe pas, création..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $profileHome -Force | Out-Null
    Write-Host "✅ Répertoire créé" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Lancement de l'authentification Gemini CLI..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host "  1. Une fenêtre de navigateur va s'ouvrir" -ForegroundColor White
Write-Host "  2. Connectez-vous avec: ohada.save6@gmail.com" -ForegroundColor White
Write-Host "  3. Autorisez l'accès à Gemini CLI" -ForegroundColor White
Write-Host "  4. Attendez le message de confirmation" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Si le processus se bloque, appuyez sur 'r' pour redémarrer" -ForegroundColor Yellow
Write-Host ""

# Lancer l'authentification
try {
    gemini auth login
    
    Write-Host ""
    Write-Host "✅ Authentification complétée!" -ForegroundColor Green
    Write-Host ""
    
    # Vérifier que le fichier de credentials existe
    $credsFile = "$profileHome\.gemini\oauth_creds.json"
    if (Test-Path $credsFile) {
        Write-Host "✅ Fichier de credentials créé: $credsFile" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Fichier de credentials non trouvé" -ForegroundColor Yellow
        Write-Host "   Attendu: $credsFile" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🧪 Test du profile4..." -ForegroundColor Cyan
    Write-Host ""
    
    # Tester le profil
    $testResult = gemini -m gemini-2.5-flash --prompt "Test du profile4 - réponds juste 'OK'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Test réussi!" -ForegroundColor Green
        Write-Host "Réponse: $testResult" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Profile4 est prêt à être utilisé!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
        Write-Host "  1. Redémarrer le serveur Multi-CLI: npm run multi-cli" -ForegroundColor White
        Write-Host "  2. Tester l'endpoint: POST http://localhost:25815/api/v1/cli/profile4/chat" -ForegroundColor White
        Write-Host "  3. Vérifier Swagger UI: http://localhost:25815/api-docs" -ForegroundColor White
    } else {
        Write-Host "❌ Test échoué" -ForegroundColor Red
        Write-Host "   Vérifiez l'authentification et réessayez" -ForegroundColor White
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'authentification" -ForegroundColor Red
    Write-Host "   $_" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Solutions:" -ForegroundColor Yellow
    Write-Host "  1. Vérifiez que Gemini CLI est installé: gemini --version" -ForegroundColor White
    Write-Host "  2. Réessayez: .\scripts\auth-profile4.ps1" -ForegroundColor White
    Write-Host "  3. Authentification manuelle:" -ForegroundColor White
    Write-Host "     `$env:GEMINI_CLI_HOME=`"$HOME\.gemini-profile4`"" -ForegroundColor Gray
    Write-Host "     gemini auth login" -ForegroundColor Gray
}

Write-Host ""
