const express = require("express");
const {
  getContactsList,
  getContactById,
  createContact,
  updateContactById,
  updateStatusContact,
  deleteContactById,
} = require("../../controllers/contacts");
const { validation } = require("../../middlewares");
const { isValidId } = require("../../middlewares/isValidId");
const { ctrlWrapper } = require("../../utils");
const { joiSchema, favoriteSchema } = require("../../models/contact");

const router = express.Router();

router
  .route("/")
  .get(ctrlWrapper(getContactsList))
  .post(validation(joiSchema), ctrlWrapper(createContact));

router
  .route("/:contactId")
  .get(isValidId, ctrlWrapper(getContactById))
  .put(isValidId, validation(joiSchema), ctrlWrapper(updateContactById))
  .delete(isValidId, ctrlWrapper(deleteContactById));

router
  .route ("/:contactId/favorite")
  .patch(isValidId, validation(favoriteSchema), ctrlWrapper(updateStatusContact))

module.exports = router;