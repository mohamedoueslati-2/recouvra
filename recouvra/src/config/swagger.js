const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RECOUVRA',
      version: '1.0.0',
      description: 'Documentation interactive des API RECOUVRA',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Serveur de developpement' },
    ],
     // ⭐ ICI tu définis l'ordre
    tags: [
      { name: "Authentification" },
      { name: "Clients" },
      { name: "Factures" },
      { name: "Paiements" },
      { name: "ActionsRecouvrement" },
      { name: "Utilisateurs" },
      { name: "Statistiques" }
      
    ],

    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [
    path.join(__dirname, '../docs/schemas/*.yaml'),
    path.join(__dirname, '../docs/paths/*.yaml'),
  ],
};

const spec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
};

module.exports = setupSwagger;
