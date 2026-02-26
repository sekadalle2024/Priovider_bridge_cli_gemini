/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Documentation Swagger pour Gemini API Key Rotative
 */

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Gemini API Key Rotative',
    version: '1.9.0',
    description: `
# Gemini API Key avec Rotation Automatique

Ce serveur utilise **UNIQUEMENT les clés API** avec rotation automatique (pas d'OAuth).

## 🔑 Configuration

- **27 clés API** configurées
- **Capacité**: 135 requêtes/minute
- **Rotation automatique** pour respecter les limites (5 req/min par clé)

## 🎯 Provider

\`gemini_api_key_rotative\` - Toutes les réponses incluent ce provider pour confirmation.

## 📊 Statistiques

Utilisez \`GET /api/stats\` pour voir l'utilisation en temps réel de chaque clé.
    `,
    contact: {
      name: 'AionUi Support',
      url: 'https://github.com/iOfficeAI/AionUi',
      email: 'service@aionui.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:25808',
      description: 'Serveur local'
    }
  ],
  tags: [
    {
      name: 'Chat',
      description: 'Endpoints de conversation'
    },
    {
      name: 'Generation',
      description: 'Endpoints de génération de texte'
    },
    {
      name: 'Monitoring',
      description: 'Endpoints de monitoring et statistiques'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Monitoring'],
        summary: 'Health check',
        description: 'Vérifier que le serveur fonctionne et voir le nombre de clés chargées',
        responses: {
          '200': {
            description: 'Serveur opérationnel',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number', example: 123.45 },
                    provider: { type: 'string', example: 'gemini_api_key_rotative' },
                    keysLoaded: { type: 'number', example: 27 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/stats': {
      get: {
        tags: ['Monitoring'],
        summary: 'Statistiques des clés API',
        description: 'Voir l\'utilisation en temps réel de chaque clé API',
        responses: {
          '200': {
            description: 'Statistiques d\'utilisation',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalKeys: { type: 'number', example: 27 },
                    availableKeys: { type: 'number', example: 25 },
                    usage: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          index: { type: 'number', example: 0 },
                          requestsThisMinute: { type: 'number', example: 3 },
                          available: { type: 'boolean', example: true }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/version': {
      get: {
        tags: ['Monitoring'],
        summary: 'Version de l\'API',
        description: 'Obtenir la version et les informations du serveur',
        responses: {
          '200': {
            description: 'Informations de version',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: { type: 'string', example: '1.9.0' },
                    api: { type: 'string', example: 'gemini-api-key-rotative' },
                    provider: { type: 'string', example: 'gemini_api_key_rotative' },
                    keysLoaded: { type: 'number', example: 27 }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Chat avec Gemini',
        description: `
Envoyer un message à Gemini et recevoir une réponse.

**Note importante**: Ce endpoint utilise la rotation automatique des clés API.
Chaque réponse indique quelle clé a été utilisée.
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    description: 'Liste des messages de la conversation',
                    items: {
                      type: 'object',
                      required: ['role', 'content'],
                      properties: {
                        role: {
                          type: 'string',
                          enum: ['user', 'assistant'],
                          example: 'user'
                        },
                        content: {
                          type: 'string',
                          example: 'Bonjour, comment vas-tu?'
                        }
                      }
                    }
                  },
                  stream: {
                    type: 'boolean',
                    default: false,
                    description: 'Activer le streaming (non supporté actuellement)'
                  },
                  model: {
                    type: 'string',
                    default: 'gemini-2.5-flash',
                    example: 'gemini-2.5-flash',
                    description: 'Modèle Gemini à utiliser'
                  },
                  options: {
                    type: 'object',
                    properties: {
                      temperature: {
                        type: 'number',
                        minimum: 0,
                        maximum: 2,
                        default: 0.7,
                        example: 0.7,
                        description: 'Température de génération (0 = déterministe, 2 = créatif)'
                      },
                      max_tokens: {
                        type: 'number',
                        example: 1000,
                        description: 'Nombre maximum de tokens à générer'
                      }
                    }
                  }
                }
              },
              examples: {
                simple: {
                  summary: 'Message simple',
                  value: {
                    messages: [
                      { role: 'user', content: 'Bonjour!' }
                    ],
                    stream: false
                  }
                },
                conversation: {
                  summary: 'Conversation',
                  value: {
                    messages: [
                      { role: 'user', content: 'Bonjour!' },
                      { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider?' },
                      { role: 'user', content: 'Écris un haiku sur l\'IA' }
                    ],
                    stream: false,
                    options: {
                      temperature: 0.9
                    }
                  }
                },
                creative: {
                  summary: 'Génération créative',
                  value: {
                    messages: [
                      { role: 'user', content: 'Écris une histoire courte sur un robot qui découvre l\'amour' }
                    ],
                    stream: false,
                    model: 'gemini-2.5-flash',
                    options: {
                      temperature: 1.2,
                      max_tokens: 2000
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Réponse générée avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    model: { type: 'string', example: 'gemini-2.5-flash' },
                    provider: { type: 'string', example: 'gemini_api_key_rotative' },
                    created_at: { type: 'string', format: 'date-time' },
                    message: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'assistant' },
                        content: { type: 'string', example: 'Bonjour! Comment puis-je vous aider aujourd\'hui?' }
                      }
                    },
                    done: { type: 'boolean', example: true },
                    keyUsed: { type: 'string', example: 'Key 5/27', description: 'Indique quelle clé API a été utilisée' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Requête invalide',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'No messages provided' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Erreur serveur',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    provider: { type: 'string', example: 'gemini_api_key_rotative' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/generate': {
      post: {
        tags: ['Generation'],
        summary: 'Générer du texte',
        description: `
Générer du texte à partir d'un prompt simple.

**Note**: Cet endpoint est un alias de /api/chat pour une utilisation plus simple.
        `,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['prompt'],
                properties: {
                  prompt: {
                    type: 'string',
                    example: 'Écris un haiku sur le code',
                    description: 'Le prompt de génération'
                  },
                  stream: {
                    type: 'boolean',
                    default: false
                  },
                  model: {
                    type: 'string',
                    default: 'gemini-2.5-flash',
                    example: 'gemini-2.5-flash'
                  },
                  options: {
                    type: 'object',
                    properties: {
                      temperature: {
                        type: 'number',
                        minimum: 0,
                        maximum: 2,
                        default: 0.7,
                        example: 0.7
                      },
                      max_tokens: {
                        type: 'number',
                        example: 1000
                      }
                    }
                  }
                }
              },
              examples: {
                haiku: {
                  summary: 'Haiku',
                  value: {
                    prompt: 'Écris un haiku sur l\'intelligence artificielle',
                    stream: false
                  }
                },
                code: {
                  summary: 'Génération de code',
                  value: {
                    prompt: 'Écris une fonction Python pour calculer la suite de Fibonacci',
                    stream: false,
                    options: {
                      temperature: 0.3
                    }
                  }
                },
                story: {
                  summary: 'Histoire courte',
                  value: {
                    prompt: 'Raconte une histoire courte sur un développeur qui découvre un bug mystérieux',
                    stream: false,
                    options: {
                      temperature: 1.0,
                      max_tokens: 1500
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Texte généré avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    model: { type: 'string', example: 'gemini-2.5-flash' },
                    provider: { type: 'string', example: 'gemini_api_key_rotative' },
                    created_at: { type: 'string', format: 'date-time' },
                    message: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', example: 'assistant' },
                        content: { type: 'string' }
                      }
                    },
                    done: { type: 'boolean', example: true },
                    keyUsed: { type: 'string', example: 'Key 5/27' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

function getSwaggerHTML() {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gemini API Key Rotative - Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .topbar {
      background-color: #1a73e8 !important;
    }
    .swagger-ui .topbar .download-url-wrapper {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(swaggerSpec)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: true,
        displayRequestDuration: true,
        filter: true,
        syntaxHighlight: {
          activate: true,
          theme: "monokai"
        }
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
  `;
}

module.exports = {
  swaggerSpec,
  getSwaggerHTML
};
