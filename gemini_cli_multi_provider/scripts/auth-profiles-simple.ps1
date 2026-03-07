# Script d'authentification simplifie pour les profils Gemini CLI

Write-Host "==================================================================="
Write-Host "Authentification Multi-Profils Gemini CLI"
Write-Host "==================================================================="
Write-Host ""

# Profil 2 - ohada.save@gmail.com
Write-Host "Profil 2: ohada.save@gmail.com"
Write-Host "-------------------------------------------------------------------"
Write-Host ""
Write-Host "IMPORTANT:"
Write-Host "  1. Une fenetre de navigateur va s'ouvrir"
Write-Host "  2. Connectez-vous avec: ohada.save@gmail.com"
Write-Host "  3. Autorisez l'acces a Gemini CLI"
Write-Host ""

$continue = Read-Host "Voulez-vous authentifier ce profil? (O/N)"

if ($continue.ToUpper() -eq "O") {
    Write-Host ""
    Write-Host "Authentification en cours..."
    Write-Host ""
    
    $env:GEMINI_CLI_HOME = "$HOME\.gemini-profile2"
    
    # Creer le repertoire
    if (-not (Test-Path "$HOME\.gemini-profile2")) {
        New-Item -ItemType Directory -Path "$HOME\.gemini-profile2" -Force | Out-Null
        Write-Host "Repertoire cree: $HOME\.gemini-profile2"
    }
    
    gemini auth login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Authentification reussie pour profile2!" -ForegroundColor Green
        $profile2Success = $true
    } else {
        Write-Host ""
        Write-Host "Echec de l'authentification pour profile2" -ForegroundColor Red
        $profile2Success = $false
    }
} else {
    Write-Host "Profile2 ignore"
    $profile2Success = $false
}

Write-Host ""
Write-Host "==================================================================="
Write-Host ""

# Profil 3 - ohada.save2@gmail.com
Write-Host "Profil 3: ohada.save2@gmail.com"
Write-Host "-------------------------------------------------------------------"
Write-Host ""
Write-Host "IMPORTANT:"
Write-Host "  1. Une fenetre de navigateur va s'ouvrir"
Write-Host "  2. Connectez-vous avec: ohada.save2@gmail.com"
Write-Host "  3. Autorisez l'acces a Gemini CLI"
Write-Host ""

$continue = Read-Host "Voulez-vous authentifier ce profil? (O/N)"

if ($continue.ToUpper() -eq "O") {
    Write-Host ""
    Write-Host "Authentification en cours..."
    Write-Host ""
    
    $env:GEMINI_CLI_HOME = "$HOME\.gemini-profile3"
    
    # Creer le repertoire
    if (-not (Test-Path "$HOME\.gemini-profile3")) {
        New-Item -ItemType Directory -Path "$HOME\.gemini-profile3" -Force | Out-Null
        Write-Host "Repertoire cree: $HOME\.gemini-profile3"
    }
    
    gemini auth login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Authentification reussie pour profile3!" -ForegroundColor Green
        $profile3Success = $true
    } else {
        Write-Host ""
        Write-Host "Echec de l'authentification pour profile3" -ForegroundColor Red
        $profile3Success = $false
    }
} else {
    Write-Host "Profile3 ignore"
    $profile3Success = $false
}

# Resume
Write-Host ""
Write-Host "==================================================================="
Write-Host "RESUME"
Write-Host "==================================================================="
Write-Host ""

if ($profile2Success) {
    Write-Host "Profile2 (ohada.save@gmail.com): OK" -ForegroundColor Green
} else {
    Write-Host "Profile2 (ohada.save@gmail.com): Non configure" -ForegroundColor Gray
}

if ($profile3Success) {
    Write-Host "Profile3 (ohada.save2@gmail.com): OK" -ForegroundColor Green
} else {
    Write-Host "Profile3 (ohada.save2@gmail.com): Non configure" -ForegroundColor Gray
}

Write-Host ""

# Generer la configuration
if ($profile2Success -or $profile3Success) {
    Write-Host "==================================================================="
    Write-Host "Configuration .env"
    Write-Host "==================================================================="
    Write-Host ""
    
    $profiles = @("profile1")
    if ($profile2Success) { $profiles += "profile2" }
    if ($profile3Success) { $profiles += "profile3" }
    
    $profileList = $profiles -join ','
    
    Write-Host "Ajoutez ceci dans votre fichier .env:"
    Write-Host ""
    Write-Host "MULTI_CLI_PROFILES=$profileList"
    Write-Host ""
    
    if ($profile2Success) {
        Write-Host "CLI_PROFILE2_HOME=~/.gemini-profile2"
        Write-Host "CLI_PROFILE2_PORT=25812"
        Write-Host "CLI_PROFILE2_ACCOUNT=ohada.save@gmail.com"
        Write-Host "CLI_PROFILE2_ENABLED=true"
        Write-Host ""
    }
    
    if ($profile3Success) {
        Write-Host "CLI_PROFILE3_HOME=~/.gemini-profile3"
        Write-Host "CLI_PROFILE3_PORT=25813"
        Write-Host "CLI_PROFILE3_ACCOUNT=ohada.save2@gmail.com"
        Write-Host "CLI_PROFILE3_ENABLED=true"
        Write-Host ""
    }
    
    Write-Host "==================================================================="
    Write-Host ""
    Write-Host "Prochaines etapes:"
    Write-Host "  1. Copier la configuration ci-dessus dans .env"
    Write-Host "  2. Redemarrer le serveur: npm run multi-cli"
    Write-Host "  3. Tester: npm run test:multi-cli"
}

Write-Host ""
Write-Host "Script termine!"
