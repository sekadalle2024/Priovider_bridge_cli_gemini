# Script pour vérifier l'accès à Gemini 3.1 Pro Preview

Write-Host "🔍 Vérification de l'accès à Gemini 3.1 Pro Preview" -ForegroundColor Cyan
Write-Host "=" * 60

# Méthode 1: Vérifier via Google AI Studio
Write-Host "`n📋 Méthode 1: Vérifier votre compte" -ForegroundColor Yellow
Write-Host "-" * 60
Write-Host "Votre compte: ohada.finance@gmail.com"
Write-Host "Plan: Gemini Code Assist for individuals"
Write-Host ""
Write-Host "Pour vérifier l'accès à Gemini 3.1:"
Write-Host "1. Ouvrir: https://aistudio.google.com/"
Write-Host "2. Se connecter avec: ohada.finance@gmail.com"
Write-Host "3. Vérifier les modèles disponibles dans la liste"
Write-Host ""

# Méthode 2: Tester avec Gemini CLI en mode interactif
Write-Host "`n📋 Méthode 2: Test avec Gemini CLI (RECOMMANDÉ)" -ForegroundColor Yellow
Write-Host "-" * 60
Write-Host "Exécutez ces commandes dans un nouveau terminal:"
Write-Host ""
Write-Host "  gemini" -ForegroundColor Green
Write-Host "  /model" -ForegroundColor Green
Write-Host ""
Write-Host "Puis sélectionnez 'Manual' et cherchez 'gemini-3.1-pro-preview'"
Write-Host ""
Write-Host "Si vous le voyez dans la liste → ✅ Vous avez accès"
Write-Host "Si vous ne le voyez pas → ❌ Pas encore disponible"
Write-Host ""

# Méthode 3: Informations sur le déploiement
Write-Host "`n📋 Méthode 3: Informations sur le déploiement" -ForegroundColor Yellow
Write-Host "-" * 60
Write-Host "Gemini 3.1 Pro Preview est en déploiement PROGRESSIF"
Write-Host ""
Write-Host "Cela signifie:"
Write-Host "  • Google déploie le modèle par vagues"
Write-Host "  • Tous les utilisateurs ne l'ont pas en même temps"
Write-Host "  • Cela peut prendre quelques jours/semaines"
Write-Host ""
Write-Host "Selon la documentation officielle (3 mars 2026):"
Write-Host "  'Gemini 3.1 Pro Preview is rolling out.'"
Write-Host "  'To determine whether you have access...'"
Write-Host ""

# Résumé
Write-Host "`n📊 RÉSUMÉ" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""
Write-Host "✅ Ce que vous avez CERTAINEMENT:" -ForegroundColor Green
Write-Host "  • Gemini CLI v0.32.1"
Write-Host "  • gemini-2.5-pro (haute qualité)"
Write-Host "  • gemini-2.5-flash (rapide)"
Write-Host "  • gemini-2.5-flash-lite (léger)"
Write-Host "  • Routage 'auto' (intelligent)"
Write-Host ""
Write-Host "❓ Ce que vous avez PEUT-ÊTRE:" -ForegroundColor Yellow
Write-Host "  • gemini-3.1-pro-preview (déploiement progressif)"
Write-Host "  • gemini-3-pro"
Write-Host "  • gemini-3-flash"
Write-Host ""
Write-Host "🎯 RECOMMANDATION:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Testez avec la Méthode 2 (gemini /model)"
Write-Host "2. Si vous ne l'avez pas encore:"
Write-Host "   → Utilisez 'auto' (routage intelligent)"
Write-Host "   → Utilisez 'gemini-2.5-pro' (excellente qualité)"
Write-Host "3. Réessayez dans quelques jours"
Write-Host ""
Write-Host "Le routage 'auto' utilisera automatiquement Gemini 3.1"
Write-Host "dès qu'il sera disponible pour votre compte!"
Write-Host ""

# Instructions pour tester maintenant
Write-Host "`n🚀 TESTER MAINTENANT" -ForegroundColor Green
Write-Host "=" * 60
Write-Host ""
Write-Host "Ouvrez un nouveau terminal PowerShell et exécutez:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  gemini" -ForegroundColor Cyan
Write-Host ""
Write-Host "Puis tapez:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  /model" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sélectionnez 'Manual' avec les flèches et Entrée"
Write-Host ""
Write-Host "Cherchez dans la liste si vous voyez:"
Write-Host "  • gemini-3.1-pro-preview" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur 'q' pour quitter la liste"
Write-Host "Appuyez sur Ctrl+C pour quitter Gemini CLI"
Write-Host ""

Write-Host "=" * 60
Write-Host "Script terminé. Testez maintenant avec Gemini CLI!" -ForegroundColor Green
