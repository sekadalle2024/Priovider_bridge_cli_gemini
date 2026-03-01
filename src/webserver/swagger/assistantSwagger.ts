/**
 * Configuration Swagger pour les assistants
 */

export const assistantSwaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'AionUI Assistants API',
    version: '1.0.0',
    description: `
# API des Assistants AionUI

Cette API expose tous les assistants du dossier \`assistant/\` comme des microservices.

## Assistants disponibles

- **cowork**: Assistant autonome pour l'exécution de tâches
- **pptx-generator**: Génération de présentations PowerPoint
- **beautiful-mermaid**: Création de diagrammes Mermaid
- **pdf-to-ppt**: Conversion PDF vers PowerPoint
- **game-3d**: Génération de jeux 3D
- **ui-ux-pro-max**: Design UI/UX professionnel
- **planning-with-files**: Planification avec fichiers
- **human-3-coach**: Coach de développement personnel
- **social-job-publisher**: Publication d'offres d'emploi
- **moltbook**: Réseau social d'agents IA
- **openclaw-setup**: Configuration OpenClaw
- **story-roleplay**: Jeu de rôle narratif

## Authentification

Actuellement, l'API ne nécessite pas d'authentification. Pour un usage en production, 
il est recommandé d'ajouter une authentification par API Key.

## Rate Limiting

Pas de limitation de taux actuellement configurée.

## Modèles Gemini

Par défaut, les assistants utilisent \`gemini-2.0-flash-exp\`. Vous pouvez spécifier 
un autre modèle dans le champ \`model\` de votre requête.

Modèles disponibles:
- gemini-2.0-flash-exp (par défaut)
- gemini-1.5-pro
- gemini-1.5-flash
- gemini-1.0-pro
    `,
    contact: {
      name: 'AionUI Support',
      url: 'https://github.com/iOfficeAI/AionUi'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  servers: [
    {
      url: 'http://localhost:25808',
      description: 'Serveur de développement local'
    },
    {
      url: 'http://localhost:3000',
      description: 'Serveur de production'
    }
  ],
  tags: [
    {
      name: 'Assistants',
      description: 'Endpoints pour gérer et exécuter les assistants'
    },
    {
      name: 'Cowork',
      description: 'Assistant autonome pour l\'exécution de tâches'
    },
    {
      name: 'PPTX Generator',
      description: 'Génération de présentations PowerPoint'
    },
    {
      name: 'Beautiful Mermaid',
      description: 'Création de diagrammes Mermaid'
    },
    {
      name: 'PDF to PPT',
      description: 'Conversion PDF vers PowerPoint'
    },
    {
      name: 'Game 3D',
      description: 'Génération de jeux 3D'
    },
    {
      name: 'UI/UX Pro Max',
      description: 'Design UI/UX professionnel'
    }
  ],
  components: {
    schemas: {
      AssistantConfig: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Nom technique de l\'assistant'
          },
          displayName: {
            type: 'string',
            description: 'Nom d\'affichage de l\'assistant'
          },
          description: {
            type: 'string',
            description: 'Description de l\'assistant'
          },
          endpoint: {
            type: 'string',
            description: 'Endpoint API de l\'assistant'
          },
          capabilities: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Liste des capacités de l\'assistant'
          }
        }
      },
      AssistantRequest: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: {
            type: 'string',
            description: 'La requête utilisateur',
            example: 'Crée une présentation sur l\'IA'
          },
          context: {
            type: 'object',
            description: 'Contexte additionnel pour l\'assistant',
            example: {
              workspace: '/path/to/workspace',
              files: ['document.pdf']
            }
          },
          model: {
            type: 'string',
            description: 'Modèle Gemini à utiliser',
            default: 'gemini-2.0-flash-exp',
            enum: [
              'gemini-2.0-flash-exp',
              'gemini-1.5-pro',
              'gemini-1.5-flash',
              'gemini-1.0-pro'
            ]
          },
          temperature: {
            type: 'number',
            description: 'Température de génération (0.0 - 1.0)',
            default: 0.7,
            minimum: 0,
            maximum: 1
          },
          maxTokens: {
            type: 'number',
            description: 'Nombre maximum de tokens',
            default: 2048
          }
        }
      },
      AssistantResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indique si l\'exécution a réussi'
          },
          result: {
            type: 'string',
            description: 'Résultat de l\'exécution'
          },
          error: {
            type: 'string',
            description: 'Message d\'erreur si échec'
          },
          metadata: {
            type: 'object',
            properties: {
              assistant: {
                type: 'string',
                description: 'Nom de l\'assistant utilisé'
              },
              model: {
                type: 'string',
                description: 'Modèle utilisé'
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Horodatage de l\'exécution'
              }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          error: {
            type: 'string',
            description: 'Message d\'erreur'
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Requête invalide',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      NotFound: {
        description: 'Ressource non trouvée',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },
      InternalError: {
        description: 'Erreur interne du serveur',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
};

export default assistantSwaggerConfig;
