#!/bin/bash

# Provider Bridge — Configure Netlify Environment Variables
# This script adds all environment variables from .env to Netlify

echo "🔧 Provider Bridge — Configure Netlify Environment Variables"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Install it with:"
    echo "   npm install -g netlify-cli"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found in current directory"
    exit 1
fi

echo "📋 Reading .env file..."
echo ""

# Read .env and set variables on Netlify
while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
        continue
    fi
    
    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    # Skip if value is empty
    if [[ -z $value ]]; then
        continue
    fi
    
    echo "✅ Setting $key"
    netlify env:set "$key" "$value" --context production
done < .env

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ All environment variables configured on Netlify!"
echo ""
echo "🚀 Next steps:"
echo "   1. Redeploy: netlify deploy --prod"
echo "   2. Test: curl https://providerbridge.netlify.app/health"
echo ""
