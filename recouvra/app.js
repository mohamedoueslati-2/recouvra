const express = require('express');
const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
 res.send('Bonjour depuis Express !');
});
app.listen(PORT, () => {
 console.log(`Serveur demarre sur http://localhost:${PORT}`);
});
