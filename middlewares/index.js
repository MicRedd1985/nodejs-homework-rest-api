const { validation } = require("./validation");
const { notFound } = require("./notFound");
const { globalError } = require("./globalError");
const { user } = require ("./user");
const { validationUser } = require ("./validationUser");
const { upload } = require ("./upload");

module.exports = {
  validation,
  notFound,
  globalError,
  user,
  validationUser,
  upload,
};