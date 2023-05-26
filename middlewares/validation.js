const validation = (schema) => {
  return (reg, res, next) => {
    const { error } = schema.validate(reg.body);
    if (error) {
      error.status = 400;
      error.message = "missing required name field";
      next(error);
      return;
    }
    next();
  };
};

const validationFavorite = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      error.status = 400;
      error.message = "missing field favorite";
      next(error);
    }
    next();
  };
};

module.exports = { validation, validationFavorite };

