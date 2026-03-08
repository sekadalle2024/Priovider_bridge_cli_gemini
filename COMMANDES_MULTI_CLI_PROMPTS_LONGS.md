# 🚀 Commandes Essentielles - Multi-CLI Prompts Longs

## ⚡ Démarrage

### Redémarrer le Serveur
```bash
# Arrêter le serveur actuel
Ctrl+C

# Redémarrer avec la correction
npm run multi-cli
```

## 🧪 Tests

### Test Automatique Complet
```bash
node scripts/test-multi-cli-long-prompt.js
```

### Test Prompt Court
```bash
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Bonjour\"}],\"model\":\"gemini-2.5-flash\"}"
```

### Test Prompt Long (PowerShell)
```powershell
$body = @{
    messages = @(
        @{
            role = "user"
            content = "[Votre prompt très long ici...]"
        }
    )
    model = "gemini-2.5-flash"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:25815/api/v1/cli/chat" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## 📊 Vérifications

### Health Check
```bash
curl http://localhost:25815/health
```

### Lister les Profils
```bash
curl http://localhost:25815/api/v1/cli/profiles
```

### Statistiques des Profils
```bash
curl http://localhost:25815/api/v1/cli/profiles/stats
```

### Modèles Disponibles
```bash
curl http://localhost:25815/api/v1/cli/models
```

## 🔧 Dépannage

### Vérifier le Port
```bash
netstat -ano | findstr :25815
```

### Tuer le Processus
```bash
# Trouver le PID
netstat -ano | findstr :25815

# Tuer le processus
taskkill /PID <PID> /F
```

### Vérifier Gemini CLI
```bash
# Version
gemini --version

# Authentification
gemini auth login

# Test rapide
gemini -p "Bonjour"
```

### Authentifier les Profils
```powershell
# Tous les profils
.\scripts\auth-profiles-simple.ps1

# Profile2 uniquement
.\scripts\auth-profile2.ps1

# Profile3 uniquement
.\scripts\auth-profile3.ps1
```

## 📚 Documentation

### Ouvrir Swagger
```bash
start http://localhost:25815/api-docs
```

### Lire la Documentation
```bash
# Documentation complète
cat gemini_cli_multi_provider/CORRECTION_PROMPTS_LONGS.md

# Guide rapide
cat gemini_cli_multi_provider/DEMARRAGE_RAPIDE_PROMPTS_LONGS.md

# Documentation principale
cat gemini_cli_multi_provider/00_LIRE_EN_PREMIER.md
```

## 🔄 Rebuild (si nécessaire)

### Recompiler TypeScript
```bash
npm run build
```

### Nettoyer et Rebuild
```bash
# Nettoyer
rm -rf dist

# Rebuild
npm run build

# Redémarrer
npm run multi-cli
```

## 🎯 Tests Spécifiques

### Test Profile2
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Test profile2\"}],\"model\":\"gemini-2.5-flash\"}"
```

### Test Profile3
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile3/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Test profile3\"}],\"model\":\"gemini-2.5-flash\"}"
```

### Test Load Balancer
```bash
# Faire plusieurs requêtes pour voir la distribution
for i in {1..5}; do
  curl -X POST http://localhost:25815/api/v1/cli/chat \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Test $i\"}],\"model\":\"gemini-2.5-flash\"}"
  echo ""
done
```

## 📝 Logs

### Voir les Logs du Serveur
Les logs s'affichent dans le terminal où vous avez lancé `npm run multi-cli`

### Logs Détaillés
```bash
# Activer le mode debug
set DEBUG=*
npm run multi-cli
```

## 🔍 Monitoring

### Surveiller les Requêtes
```bash
# Dans un autre terminal
curl -s http://localhost:25815/api/v1/cli/profiles/stats | jq
```

### Surveiller en Continu (PowerShell)
```powershell
while ($true) {
    Clear-Host
    Write-Host "=== Stats Multi-CLI ===" -ForegroundColor Cyan
    Invoke-RestMethod -Uri "http://localhost:25815/api/v1/cli/profiles/stats" | ConvertTo-Json -Depth 10
    Start-Sleep -Seconds 5
}
```

## 🎯 Commandes n8n

### Tester depuis n8n
Dans un nœud HTTP Request:

**URL**: `http://localhost:25815/api/v1/cli/chat`

**Method**: POST

**Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-2.5-flash"
}
```

## 🆘 Aide Rapide

### Commande Unique
```bash
# Tout en une commande
npm run multi-cli && node scripts/test-multi-cli-long-prompt.js
```

### Vérification Complète
```bash
# Vérifier tout
echo "=== Health Check ===" && \
curl -s http://localhost:25815/health && \
echo -e "\n\n=== Profiles ===" && \
curl -s http://localhost:25815/api/v1/cli/profiles && \
echo -e "\n\n=== Models ===" && \
curl -s http://localhost:25815/api/v1/cli/models
```

---

**Serveur**: http://localhost:25815  
**Swagger**: http://localhost:25815/api-docs  
**Status**: ✅ Prêt pour prompts longs
