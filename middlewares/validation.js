const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { AppError, catchAsync } = require("../utils/index");

checkContactId = async (req, res, next) => {
  const { id } = req.params;
  const isCorrectId = isValidObjectId(id);

  if (isCorrectId) return next();

  next(AppError(404, "Not found"));
};

checkClientData = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(AppError(400, "missing fields"));

  const { name, email, phone } = req.body;
  let fieldName = "name";

  if (!email) fieldName = "email";
  else if (!phone) fieldName = "phone";

  if (!name || !email || !phone)
    return next(AppError(400, `missing required ${fieldName} field`));

  next();
});

checkStatusData = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(AppError(400, "missing field favorite"));

  next();
});

requestValidation = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().trim().min(3).max(30).required(),
    email: Joi.string().trim().min(3).max(30).required(),
    phone: Joi.string().trim().min(3).max(30).required(),
    favorite: Joi.boolean(),
  });
  const resultValidation = schema.validate(req.body);
  if (resultValidation.error)
    return next(AppError(400, resultValidation.error.message));

  next();
});


module.exports = {
  checkContactId,
  checkClientData,
  requestValidation,
  checkStatusData,
};