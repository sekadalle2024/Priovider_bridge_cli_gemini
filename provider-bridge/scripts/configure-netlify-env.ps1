# Provider Bridge — Configure Netlify Environment Variables (PowerShell)
# This script adds all environment variables from .env to Netlify

Write-Host "🔧 Provider Bridge — Configure Netlify Environment Variables" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if netlify CLI is installed
try {
    $null = Get-Command netlify -ErrorAction Stop
} catch {
    Write-Host "❌ Netlify CLI not found. Install it with:" -ForegroundColor Red
    Write-Host "   npm install -g netlify-cli" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found in current directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Reading .env file..." -ForegroundColor Yellow
Write-Host ""

# Read .env and set variables on Netlify
Get-Content ".env" | ForEach-Object {
    $line = $_.Trim()
    
    # Skip comments and empty lines
    if ($line -match "^#" -or $line -eq "") {
        return
    }
    
    # Parse key=value
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Skip if value is empty
        if ($value -eq "") {
            return
        }
        
        Write-Host "✅ Setting $key" -ForegroundColor Green
        netlify env:set $key $value --context production
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ All environment variables configured on Netlify!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Redeploy: netlify deploy --prod" -ForegroundColor White
Write-Host "   2. Test: curl https://providerbridge.netlify.app/health" -ForegroundColor White
Write-Host ""
