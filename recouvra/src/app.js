require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const clientRoutes = require('./routes/clientRoutes');

const setupSwagger = require('./config/swagger');

const app = express();

// Connexion à la base de données
connectDB();

// Middlewares pour parser le JSON
app.use(express.json());

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/clients', clientRoutes);


// Swagger
setupSwagger(app);

// Route racine
app.get('/', (req, res) => {
  res.send('Bonjour depuis Express !');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarre sur http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});