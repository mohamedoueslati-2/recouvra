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
