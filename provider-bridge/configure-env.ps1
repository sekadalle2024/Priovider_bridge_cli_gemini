# Provider Bridge — Configure Netlify Environment Variables
# Simple script to add all API keys to Netlify

Write-Host ""
Write-Host "🔧 Provider Bridge — Configuration Netlify" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# API Keys
$apiKeys = @{
    "GEMINI_API_KEY_1" = "AIzaSyB0FTk5EAq5S1Jz2QpZie_bjJ6Hfdu7E8s"
    "GEMINI_API_KEY_2" = "AIzaSyDqI21lhzrzRbfqvDbhiYleEJTh2v7reD4"
    "GEMINI_API_KEY_3" = "AIzaSyBt-gjGo9u8YsIvP872J4Z9bE08oaMs9fI"
    "GEMINI_API_KEY_4" = "AIzaSyBz8t4Ibq5w800FoGkAWfeE4yeoLIXR1lQ"
    "GEMINI_API_KEY_5" = "AIzaSyDeVZUAr5frBFplhCsAbCTG8lEuhsjcbUE"
    "GEMINI_API_KEY_6" = "AIzaSyBnlMGijGvcHu4OwguAoZVw0U0kZgK-5hw"
    "GEMINI_API_KEY_7" = "AIzaSyBcl6X0Da-wYezHh6JTEq8r2o0hThzEgNM"
    "GEMINI_API_KEY_8" = "AIzaSyD3H1I3XJX7CMUF846_It-6Yo-iLmwjUyo"
    "GEMINI_API_KEY_9" = "AIzaSyCIUt5nTKk4v4CMMXa_I92_GBSnRFfYgMw"
    "GEMINI_API_KEY_10" = "AIzaSyCtsmpNpnMcaBxoiM5BOMdYxXLusseLn58"
    "GEMINI_API_KEY_11" = "AIzaSyA3QJTjXDzvQ623IR5Y5pahsn1zSWyGw2E"
    "GEMINI_API_KEY_12" = "AIzaSyBdD9FCBucY3CX8CHmmukG0zUvIhA64U5g"
    "GEMINI_API_KEY_13" = "AIzaSyCwW1rrjl07667dddMp_6PGVAiF4zUvONE"
}

# Configuration
$config = @{
    "GEMINI_MODEL" = "gemini-2.5-flash"
    "JWT_SECRET" = "provider-bridge-prod-secret-2026"
    "ADMIN_USERNAME" = "admin"
    "ADMIN_PASSWORD" = "admin123"
    "PORT" = "25809"
    "ALLOW_REMOTE" = "true"
    "NODE_ENV" = "production"
    "API_KEY_MAX_REQUESTS_PER_MINUTE" = "15"
    "API_KEY_MAX_TOKENS_PER_DAY" = "1000000"
}

Write-Host "📋 Configuration des API Keys Gemini..." -ForegroundColor Yellow
Write-Host ""

# Set API Keys
foreach ($key in $apiKeys.Keys) {
    Write-Host "✅ $key" -ForegroundColor Green
    netlify env:set $key $apiKeys[$key] --context production 2>&1 | Out-Null
}

Write-Host ""
Write-Host "📋 Configuration des paramètres..." -ForegroundColor Yellow
Write-Host ""

# Set Config
foreach ($key in $config.Keys) {
    Write-Host "✅ $key" -ForegroundColor Green
    netlify env:set $key $config[$key] --context production 2>&1 | Out-Null
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Netlify va redéployer automatiquement" -ForegroundColor White
Write-Host "   2. Attendez 2-3 minutes" -ForegroundColor White
Write-Host "   3. Testez: curl https://providerbridge.netlify.app/v1/models" -ForegroundColor White
Write-Host ""
