#!/bin/bash

# Script de déploiement automatique sur Render via CLI
# Usage: ./scripts/deploy-render.sh

set -e

echo "🚀 Déploiement du serveur des assistants sur Render"
echo "=================================================="

# Vérifier si Render CLI est installé
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI n'est pas installé"
    echo "📦 Installation de Render CLI..."
    npm install -g @render/cli
fi

echo "✅ Render CLI installé"

# Vérifier l'authentification
echo "🔐 Vérification de l'authentification..."
if ! render whoami &> /dev/null; then
    echo "❌ Non authentifié"
    echo "🔑 Connexion à Render..."
    render login
fi

echo "✅ Authentifié sur Render"

# Obtenir les credentials OAuth Gemini
echo ""
echo "🔐 Configuration OAuth Gemini"
echo "=============================="

if [ ! -f ~/.gemini/oauth_creds.json ]; then
    echo "❌ Credentials OAuth non trouvés"
    echo "📝 Veuillez d'abord authentifier Gemini CLI:"
    echo "   gemini auth login"
    exit 1
fi

echo "✅ Credentials OAuth trouvés"

# Extraire les tokens
ACCESS_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ] || [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Impossible d'extraire les tokens OAuth"
    exit 1
fi

echo "✅ Tokens OAuth extraits"

# Créer le service
echo ""
echo "🏗️  Création du service sur Render"
echo "===================================="

# Vérifier si le service existe déjà
if render services list | grep -q "aionui-assistants"; then
    echo "⚠️  Le service 'aionui-assistants' existe déjà"
    echo "📝 Mise à jour du service..."
    
    # Mettre à jour les variables d'environnement
    render env set -s aionui-assistants \
        GEMINI_OAUTH_ACCESS_TOKEN="$ACCESS_TOKEN" \
        GEMINI_OAUTH_REFRESH_TOKEN="$REFRESH_TOKEN"
    
    echo "✅ Variables d'environnement mises à jour"
    
    # Déclencher un nouveau déploiement
    echo "🚀 Déclenchement d'un nouveau déploiement..."
    render deploy -s aionui-assistants
    
else
    echo "📝 Création d'un nouveau service..."
    
    # Créer le service via Blueprint
    if [ -f render-native.yaml ]; then
        echo "✅ Fichier render-native.yaml trouvé"
        render blueprint launch
        
        # Attendre que le service soit créé
        echo "⏳ Attente de la création du service..."
        sleep 5
        
        # Configurer les secrets OAuth
        echo "🔐 Configuration des secrets OAuth..."
        render env set -s aionui-assistants \
            GEMINI_OAUTH_ACCESS_TOKEN="$ACCESS_TOKEN" \
            GEMINI_OAUTH_REFRESH_TOKEN="$REFRESH_TOKEN"
        
        echo "✅ Service créé et configuré"
    else
        echo "❌ Fichier render-native.yaml non trouvé"
        echo "📝 Veuillez créer render-native.yaml d'abord"
        exit 1
    fi
fi

# Afficher les informations du service
echo ""
echo "📊 Informations du service"
echo "=========================="
render services list | grep aionui-assistants || echo "Service non trouvé"

# Afficher les logs
echo ""
echo "📋 Logs du déploiement"
echo "======================"
echo "Pour voir les logs en temps réel:"
echo "  render logs -s aionui-assistants -f"
echo ""
echo "Pour voir le statut:"
echo "  render services list"
echo ""
echo "Pour ouvrir le dashboard:"
echo "  render open -s aionui-assistants"

echo ""
echo "🎉 Déploiement terminé!"
echo "======================="
echo ""
echo "📡 Votre serveur sera disponible à:"
echo "   https://aionui-assistants.onrender.com"
echo ""
echo "🔗 Endpoints:"
echo "   Health:  https://aionui-assistants.onrender.com/health"
echo "   API:     https://aionui-assistants.onrender.com/api/v1"
echo "   Swagger: https://aionui-assistants.onrender.com/api-docs"
