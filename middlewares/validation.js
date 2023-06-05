const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ message: "missing fields" });

    const { name, email, phone } = req.body;
    let fieldName = "name";

    if (!email) fieldName = "email";
    else if (!phone) fieldName = "phone";

    if (!name || !email || !phone)
      if (error) {
        error.status = 400;
        error.message = `missing required ${fieldName} field`;
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

