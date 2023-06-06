const express = require("express");
const {
  getContactsList,
  getContactById,
  createContact,
  updateContactById,
  updateStatusContact,
  deleteContactById,
} = require("../../controllers/contacts");
const { validation, validationFavorite } = require("../../middlewares/validation");
const { user } = require("../../middlewares/user");
const { isValidId } = require("../../middlewares/isValidId");
const { ctrlWrapper } = require("../../utils");
const { joiSchema, favoriteSchema } = require("../../models/contact");

const router = express.Router();

router
  .route("/")
  .get(user, ctrlWrapper(getContactsList))
  .post(user, validation(joiSchema),ctrlWrapper(createContact));

router
  .route("/:contactId")
  .get(isValidId, ctrlWrapper(getContactById))
  .put(isValidId, validation(joiSchema), ctrlWrapper(updateContactById))
  .delete(isValidId, ctrlWrapper(deleteContactById));

router
  .route("/:contactId/favorite")
  .patch(isValidId, validationFavorite(favoriteSchema), ctrlWrapper(updateStatusContact))

module.exports = router;