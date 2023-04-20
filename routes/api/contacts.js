const express = require('express');


const {
  getContactsList,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
  updateStatusContact,
} = require("../../controllers/contacts");

const { validation } = require("../../middlewares/validation");
const { ctrlWrapper } = require("../../utils");
const { joiSchema, favoriteSchema } = require("../../models/contactModel");

const router = express.Router();

router
  .route("/")
  .get(ctrlWrapper(getContactsList))
  .post(validation(joiSchema), ctrlWrapper(createContact));

router
  .route("/:contactId")
  .get(ctrlWrapper(getContactById))
  .put(validation(joiSchema), ctrlWrapper(updateContactById))
  .delete(ctrlWrapper(deleteContactById));

router
  .route("/:contactId/favorite")
  .patch(validation(favoriteSchema), ctrlWrapper(updateStatusContact))

module.exports = router;