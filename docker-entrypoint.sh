#!/bin/bash
set -e

echo "🚀 Starting AionUI Assistants Server with Gemini CLI"

# Vérifier si Gemini CLI est installé
if ! command -v gemini &> /dev/null; then
    echo "❌ Gemini CLI not found, installing..."
    npm install -g @google/gemini-cli
fi

# Vérifier la version de Gemini CLI
echo "✅ Gemini CLI version:"
gemini --version || echo "⚠️  Could not get Gemini CLI version"

# Vérifier les credentials OAuth
if [ -f "/root/.gemini/oauth_creds.json" ]; then
    echo "✅ OAuth credentials found"
else
    echo "⚠️  No OAuth credentials found"
    echo "ℹ️  You need to authenticate Gemini CLI:"
    echo "   1. Run locally: gemini auth login"
    echo "   2. Copy ~/.gemini/oauth_creds.json to your Docker volume"
    echo "   3. Or set GEMINI_OAUTH_CREDS environment variable"
fi

# Si GEMINI_OAUTH_CREDS est défini, créer le fichier
if [ ! -z "$GEMINI_OAUTH_CREDS" ]; then
    echo "✅ Creating OAuth credentials from environment variable"
    mkdir -p /root/.gemini
    echo "$GEMINI_OAUTH_CREDS" > /root/.gemini/oauth_creds.json
    chmod 600 /root/.gemini/oauth_creds.json
fi

# Afficher la configuration
echo "📋 Configuration:"
echo "   Port: ${ASSISTANT_PORT:-10000}"
echo "   Model: ${GEMINI_DEFAULT_MODEL:-auto}"
echo "   Assistants: ${ASSISTANTS_PATH:-/app/assistant}"

# Démarrer le serveur
echo "🎯 Starting server..."
exec "$@"
