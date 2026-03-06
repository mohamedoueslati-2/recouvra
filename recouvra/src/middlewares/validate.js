const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const erreurs = error.details.map(err => err.message);
      return res.status(400).json({ message: "Erreur de validation", erreurs });
    }
    next();
  };
};

module.exports = validate;