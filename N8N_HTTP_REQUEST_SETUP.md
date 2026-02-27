# 🎯 Configuration HTTP Request n8n - Guide Pratique

## ✅ Curl qui fonctionne

Voici le curl qui fonctionne actuellement:

```bash
curl -X 'POST' \
  'http://localhost:25808/api/chat' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "messages": [
    {
      "role": "user",
      "content": "la capitale du senegal!"
    }
  ],
  "stream": false
}'
```

## 🔧 Configuration dans n8n

### Éta