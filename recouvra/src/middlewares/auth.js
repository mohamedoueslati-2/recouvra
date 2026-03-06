const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Accès refusé. Token manquant ou invalide." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

const autoriserRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.utilisateur.role)) {
      return res.status(403).json({ message: "Accès interdit : permissions insuffisantes." });
    }
    next();
  };
};

module.exports = { verifierToken, autoriserRoles };