const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RECOUVRA',
      version: '1.0.0',
      description: 'Documentation interactive des API RECOUVRA'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Utilisateur: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e1' },
            nom: { type: 'string', example: 'Alice Martin' },
            email: { type: 'string', format: 'email', example: 'alice@recouvra.com' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'AGENT'], example: 'AGENT' }
          }
        },
        UtilisateurInput: {
          type: 'object',
          required: ['nom', 'email', 'motDePasse', 'role'],
          properties: {
            nom: { type: 'string', minLength: 3, example: 'Alice Martin' },
            email: { type: 'string', format: 'email', example: 'alice@recouvra.com' },
            motDePasse: { type: 'string', minLength: 6, example: 'secret123' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'AGENT'], example: 'AGENT' }
          }
        },
        UtilisateurUpdate: {
          type: 'object',
          properties: {
            nom: { type: 'string', minLength: 3, example: 'Alice Dupont' },
            email: { type: 'string', format: 'email', example: 'alice.dupont@recouvra.com' },
            motDePasse: { type: 'string', minLength: 6, example: 'newSecret123' },
            role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'AGENT'], example: 'MANAGER' }
          }
        },
        ConnexionInput: {
          type: 'object',
          required: ['email', 'motDePasse'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@recouvra.com' },
            motDePasse: { type: 'string', example: 'admin123!' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Erreur serveur' }
          }
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e2' },
            raisonSociale: { type: 'string', example: 'Société ABC' },
            email: { type: 'string', format: 'email', example: 'contact@abc.com' },
            telephone: { type: 'string', example: '+21612345678' },
            adresse: { type: 'string', example: '12 Rue de la Paix, Tunis' }
          }
        },
        ClientInput: {
          type: 'object',
          required: ['raisonSociale', 'email', 'telephone', 'adresse'],
          properties: {
            raisonSociale: { type: 'string', minLength: 2, example: 'Société ABC' },
            email: { type: 'string', format: 'email', example: 'contact@abc.com' },
            telephone: { type: 'string', example: '+21612345678' },
            adresse: { type: 'string', example: '12 Rue de la Paix, Tunis' }
          }
        },
        ClientUpdate: {
          type: 'object',
          properties: {
            raisonSociale: { type: 'string', minLength: 2, example: 'Société XYZ' },
            email: { type: 'string', format: 'email', example: 'contact@xyz.com' },
            telephone: { type: 'string', example: '+21698765432' },
            adresse: { type: 'string', example: '5 Avenue Habib Bourguiba, Sfax' }
          }
        },
        Facture: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e3' },
            client: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e2', description: 'ID MongoDB du client' },
            numeroFacture: { type: 'string', example: 'FAC-2024-001' },
            montantTotal: { type: 'number', example: 1500.00 },
            montantRestant: { type: 'number', example: 750.00 },
            dateEmission: { type: 'string', format: 'date', example: '2024-01-15' },
            dateEcheance: { type: 'string', format: 'date', example: '2024-02-15' },
            statut: { type: 'string', enum: ['EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE'], example: 'EN_ATTENTE' }
          }
        },
        FactureInput: {
          type: 'object',
          required: ['client', 'numeroFacture', 'montantTotal', 'dateEmission', 'dateEcheance'],
          properties: {
            client: { type: 'string', example: '64b1f2c3d4e5f6a7b8c9d0e2', description: 'ID MongoDB du client' },
            numeroFacture: { type: 'string', example: 'FAC-2024-001' },
            montantTotal: { type: 'number', minimum: 0, example: 1500.00 },
            dateEmission: { type: 'string', format: 'date', example: '2024-01-15' },
            dateEcheance: { type: 'string', format: 'date', example: '2024-02-15' },
            statut: { type: 'string', enum: ['EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE'], example: 'EN_ATTENTE' }
          }
        },
        FactureUpdate: {
          type: 'object',
          properties: {
            dateEcheance: { type: 'string', format: 'date', example: '2024-03-15' },
            statut: { type: 'string', enum: ['EN_ATTENTE', 'EN_RETARD', 'PAYEE_PARTIELLEMENT', 'PAYEE'], example: 'EN_RETARD' }
          }
        }
      }
    },
    paths: {
      '/api/auth/connexion': {
        post: {
          tags: ['Authentification'],
          summary: 'Connexion utilisateur',
          description: 'Authentifie un utilisateur et retourne un token JWT.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ConnexionInput' }
              }
            }
          },
          responses: {
            200: {
              description: 'Connexion réussie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Connexion réussie' },
                      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                      role: { type: 'string', example: 'ADMIN' }
                    }
                  }
                }
              }
            },
            400: { description: 'Email ou mot de passe incorrect', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Erreur serveur', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/auth/session': {
        get: {
          tags: ['Authentification'],
          summary: 'Vérifier la session',
          description: 'Vérifie la validité du token JWT et retourne les informations de session.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Session valide',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Session valide' },
                      utilisateur: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          role: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: { description: 'Token manquant ou invalide', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/utilisateurs': {
        get: {
          tags: ['Utilisateurs'],
          summary: 'Lister tous les utilisateurs',
          description: 'Retourne la liste de tous les utilisateurs. Requiert le rôle ADMIN.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des utilisateurs',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Utilisateur' } }
                }
              }
            },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        post: {
          tags: ['Utilisateurs'],
          summary: 'Créer un utilisateur',
          description: 'Crée un nouvel utilisateur. Requiert le rôle ADMIN.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UtilisateurInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Utilisateur créé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Utilisateur créé avec succès' },
                      utilisateur: { $ref: '#/components/schemas/Utilisateur' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides ou email déjà utilisé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/clients': {
        get: {
          tags: ['Clients'],
          summary: 'Récupérer tous les clients',
          description: 'Retourne la liste de tous les clients. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des clients',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Client' } }
                }
              }
            },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        post: {
          tags: ['Clients'],
          summary: 'Créer un client',
          description: 'Crée un nouveau client. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ClientInput' }
              }
            }
          },
          responses: {
            201: {
              description: 'Client créé avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Client créé avec succès' },
                      client: { $ref: '#/components/schemas/Client' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides ou email déjà utilisé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/clients/{id}': {
        get: {
          tags: ['Clients'],
          summary: 'Récupérer un client par ID',
          description: 'Retourne un client spécifique. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB du client' }
          ],
          responses: {
            200: { description: 'Client trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Client non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        put: {
          tags: ['Clients'],
          summary: 'Mettre à jour un client',
          description: 'Met à jour les informations d\'un client. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB du client' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ClientUpdate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Client mis à jour',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Client mis à jour avec succès' },
                      client: { $ref: '#/components/schemas/Client' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Client non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        delete: {
          tags: ['Clients'],
          summary: 'Supprimer un client',
          description: 'Supprime un client par son ID. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB du client' }
          ],
          responses: {
            200: { description: 'Client supprimé', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Client supprimé avec succès' } } } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Client non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/utilisateurs/{id}': {
        get: {
          tags: ['Utilisateurs'],
          summary: 'Obtenir un utilisateur par ID',
          description: 'Retourne un utilisateur spécifique. Requiert le rôle ADMIN.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: "ID MongoDB de l'utilisateur" }
          ],
          responses: {
            200: { description: 'Utilisateur trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Utilisateur' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Utilisateur non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        put: {
          tags: ['Utilisateurs'],
          summary: 'Mettre à jour un utilisateur',
          description: 'Met à jour les informations d\'un utilisateur. Requiert le rôle ADMIN.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: "ID MongoDB de l'utilisateur" }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UtilisateurUpdate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Utilisateur mis à jour',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Utilisateur mis à jour avec succès' },
                      utilisateur: { $ref: '#/components/schemas/Utilisateur' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Utilisateur non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        delete: {
          tags: ['Utilisateurs'],
          summary: 'Supprimer un utilisateur',
          description: 'Supprime un utilisateur par son ID. Requiert le rôle ADMIN.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: "ID MongoDB de l'utilisateur" }
          ],
          responses: {
            200: { description: 'Utilisateur supprimé', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Utilisateur supprimé avec succès' } } } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Utilisateur non trouvé', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/factures': {
        get: {
          tags: ['Factures'],
          summary: 'Récupérer toutes les factures',
          description: 'Retourne la liste de toutes les factures avec les infos client. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Liste des factures',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Facture' } } } }
            },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        post: {
          tags: ['Factures'],
          summary: 'Créer une facture',
          description: 'Crée une nouvelle facture liée à un client. Requiert le rôle MANAGER ou AGENT.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/FactureInput' } } }
          },
          responses: {
            201: {
              description: 'Facture créée avec succès',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Facture créée avec succès' },
                      facture: { $ref: '#/components/schemas/Facture' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Client introuvable', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/factures/client/{clientId}': {
        get: {
          tags: ['Factures'],
          summary: 'Récupérer les factures d\'un client',
          description: 'Retourne toutes les factures associées à un client spécifique.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'clientId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB du client' }
          ],
          responses: {
            200: { description: 'Factures du client', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Facture' } } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/factures/{id}': {
        get: {
          tags: ['Factures'],
          summary: 'Récupérer une facture par ID',
          description: 'Retourne une facture avec les détails du client.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB de la facture' }
          ],
          responses: {
            200: { description: 'Facture trouvée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Facture' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Facture non trouvée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        put: {
          tags: ['Factures'],
          summary: 'Mettre à jour une facture',
          description: 'Met à jour la date d\'échéance ou le statut d\'une facture.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB de la facture' }
          ],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/FactureUpdate' } } }
          },
          responses: {
            200: {
              description: 'Facture mise à jour',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Facture mise à jour avec succès' },
                      facture: { $ref: '#/components/schemas/Facture' }
                    }
                  }
                }
              }
            },
            400: { description: 'Données invalides', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Facture non trouvée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        },
        delete: {
          tags: ['Factures'],
          summary: 'Supprimer une facture',
          description: 'Supprime une facture par son ID.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID MongoDB de la facture' }
          ],
          responses: {
            200: { description: 'Facture supprimée', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Facture supprimée avec succès' } } } } } },
            401: { description: 'Non authentifié', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            403: { description: 'Accès interdit', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Facture non trouvée', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      }
    }
  },
  apis: []
};

const spec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
};

module.exports = setupSwagger;
