const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  const isCorrectId = isValidObjectId(contactId);
  if (!isCorrectId) {
    const error = new Error("Not found!");
    error.status = 400;
    throw error;
  }
  next();
};

module.exports = { isValidId }