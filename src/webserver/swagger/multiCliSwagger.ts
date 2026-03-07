import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-CLI Gemini API',
      version: '1.0.0',
      description: 'API REST pour accéder à plusieurs comptes Google Gemini CLI avec des endpoints OpenAI compatibles',
      contact: {
        name: 'Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:25815',
        description: 'Serveur de développement'
      }
    ],
    tags: [
      {
        name: 'Chat',
        description: 'Endpoints de chat compatibles OpenAI'
      },
      {
        name: 'Profiles',
        description: 'Gestion des profils Gemini CLI'
      },
      {
        name: 'Health',
        description: 'Vérification de l\'état du serveur'
      }
    ],
    components: {
      schemas: {
        ChatMessage: {
          type: 'object',
          required: ['role', 'content'],
          properties: {
            role: {
              type: 'string',
              enum: ['user', 'assistant', 'system'],
              description: 'Rôle du message'
            },
            content: {
              type: 'string',
              description: 'Contenu du message'
            }
          }
        },
        ChatRequest: {
          type: 'object',
          required: ['messages'],
          properties: {
            model: {
              type: 'string',
              default: 'gemini-2.5-flash',
              description: 'Modèle Gemini à utiliser',
              enum: [
                'gemini-2.5-flash',
                'gemini-2.5-pro',
                'gemini-2.0-flash',
                'gemini-1.5-flash',
                'gemini-1.5-pro'
              ]
            },
            messages: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ChatMessage'
              },
              description: 'Liste des messages de la conversation'
            },
            temperature: {
              type: 'number',
              minimum: 0,
              maximum: 2,
              default: 0.7,
              description: 'Température de génération (0-2)'
            },
            max_tokens: {
              type: 'integer',
              minimum: 1,
              default: 1000,
              description: 'Nombre maximum de tokens à générer'
            }
          }
        },
        ChatResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID unique de la réponse'
            },
            object: {
              type: 'string',
              default: 'chat.completion',
              description: 'Type d\'objet'
            },
            created: {
              type: 'integer',
              description: 'Timestamp de création'
            },
            model: {
              type: 'string',
              description: 'Modèle utilisé'
            },
            choices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  index: {
                    type: 'integer'
                  },
                  message: {
                    $ref: '#/components/schemas/ChatMessage'
                  },
                  finish_reason: {
                    type: 'string',
                    enum: ['stop', 'length', 'error']
                  }
                }
              }
            },
            usage: {
              type: 'object',
              properties: {
                prompt_tokens: {
                  type: 'integer'
                },
                completion_tokens: {
                  type: 'integer'
                },
                total_tokens: {
                  type: 'integer'
                }
              }
            }
          }
        },
        Profile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID du profil'
            },
            name: {
              type: 'string',
              description: 'Nom du profil'
            },
            account: {
              type: 'string',
              description: 'Compte Google associé'
            },
            port: {
              type: 'integer',
              description: 'Port du profil'
            },
            enabled: {
              type: 'boolean',
              description: 'Profil activé ou non'
            }
          }
        },
        ProfileStats: {
          type: 'object',
          properties: {
            requests: {
              type: 'integer',
              description: 'Nombre total de requêtes'
            },
            errors: {
              type: 'integer',
              description: 'Nombre d\'erreurs'
            },
            avgResponseTime: {
              type: 'number',
              description: 'Temps de réponse moyen (ms)'
            },
            lastUsed: {
              type: 'string',
              format: 'date-time',
              description: 'Dernière utilisation'
            },
            isAvailable: {
              type: 'boolean',
              description: 'Profil disponible'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false
            },
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Vérifier l\'état du serveur',
          description: 'Retourne l\'état de santé du serveur Multi-CLI',
          responses: {
            '200': {
              description: 'Serveur opérationnel',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok'
                      },
                      service: {
                        type: 'string',
                        example: 'multi-cli-gemini'
                      },
                      profiles: {
                        type: 'integer',
                        example: 2
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/cli/profiles': {
        get: {
          tags: ['Profiles'],
          summary: 'Liste tous les profils',
          description: 'Retourne la liste de tous les profils Gemini CLI configurés',
          responses: {
            '200': {
              description: 'Liste des profils',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        default: true
                      },
                      count: {
                        type: 'integer'
                      },
                      profiles: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Profile'
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
      '/api/v1/cli/profiles/stats': {
        get: {
          tags: ['Profiles'],
          summary: 'Statistiques de tous les profils',
          description: 'Retourne les statistiques d\'utilisation de tous les profils',
          responses: {
            '200': {
              description: 'Statistiques des profils',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        default: true
                      },
                      stats: {
                        type: 'object',
                        additionalProperties: {
                          $ref: '#/components/schemas/ProfileStats'
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
      '/api/v1/cli/profiles/{profileId}': {
        get: {
          tags: ['Profiles'],
          summary: 'Détails d\'un profil',
          description: 'Retourne les détails et statistiques d\'un profil spécifique',
          parameters: [
            {
              name: 'profileId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['profile1', 'profile2', 'profile3']
              },
              description: 'ID du profil'
            }
          ],
          responses: {
            '200': {
              description: 'Détails du profil',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        default: true
                      },
                      profile: {
                        $ref: '#/components/schemas/Profile'
                      },
                      stats: {
                        $ref: '#/components/schemas/ProfileStats'
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Profil non trouvé',
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
      },
      '/api/v1/cli/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat avec load balancing automatique',
          description: 'Envoie un message et reçoit une réponse. Le serveur sélectionne automatiquement un profil disponible (round-robin)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChatRequest'
                },
                examples: {
                  simple: {
                    summary: 'Message simple',
                    value: {
                      model: 'gemini-2.5-flash',
                      messages: [
                        {
                          role: 'user',
                          content: 'Bonjour, comment vas-tu?'
                        }
                      ]
                    }
                  },
                  conversation: {
                    summary: 'Conversation',
                    value: {
                      model: 'gemini-2.5-flash',
                      messages: [
                        {
                          role: 'user',
                          content: 'Quelle est la capitale de la France?'
                        },
                        {
                          role: 'assistant',
                          content: 'La capitale de la France est Paris.'
                        },
                        {
                          role: 'user',
                          content: 'Et combien d\'habitants?'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Réponse du chat',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ChatResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Requête invalide',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erreur serveur',
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
      },
      '/api/v1/cli/profile2/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat avec Profile 2 (ohada.save@gmail.com)',
          description: 'Envoie un message en utilisant spécifiquement le compte ohada.save@gmail.com',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChatRequest'
                },
                examples: {
                  simple: {
                    summary: 'Message simple',
                    value: {
                      model: 'gemini-2.5-flash',
                      messages: [
                        {
                          role: 'user',
                          content: 'Bonjour depuis profile2'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Réponse du chat',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ChatResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Requête invalide',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Profil non trouvé',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erreur serveur',
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
      },
      '/api/v1/cli/profile3/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat avec Profile 3 (ohada.save3@gmail.com)',
          description: 'Envoie un message en utilisant spécifiquement le compte ohada.save3@gmail.com',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ChatRequest'
                },
                examples: {
                  simple: {
                    summary: 'Message simple',
                    value: {
                      model: 'gemini-2.5-flash',
                      messages: [
                        {
                          role: 'user',
                          content: 'Bonjour depuis profile3'
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Réponse du chat',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ChatResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Requête invalide',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '404': {
              description: 'Profil non trouvé',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            '500': {
              description: 'Erreur serveur',
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
      },
      '/api/v1/cli/profiles/{profileId}/enable': {
        post: {
          tags: ['Profiles'],
          summary: 'Activer un profil',
          description: 'Active un profil désactivé',
          parameters: [
            {
              name: 'profileId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['profile1', 'profile2', 'profile3']
              }
            }
          ],
          responses: {
            '200': {
              description: 'Profil activé',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        default: true
                      },
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/v1/cli/profiles/{profileId}/disable': {
        post: {
          tags: ['Profiles'],
          summary: 'Désactiver un profil',
          description: 'Désactive temporairement un profil',
          parameters: [
            {
              name: 'profileId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                enum: ['profile1', 'profile2', 'profile3']
              }
            }
          ],
          responses: {
            '200': {
              description: 'Profil désactivé',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        default: true
                      },
                      message: {
                        type: 'string'
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
  apis: []
};

export const multiCliSwaggerSpec = swaggerJsdoc(options);
