const express = require('express');


const {
  getContactsList,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} = require("../../controllers/contacts");

const {
  checkContactId,
  checkClientData,
  requestValidation,
} = require("../../middlewares/validation");

const router = express.Router();

router
  .route("/")
  .get(getContactsList)
  .post(checkClientData, requestValidation, createContact);

router.use("/:id", checkContactId);
router
  .route("/:id")
  .get(getContactById)
  .put(checkClientData, requestValidation, updateContactById)
  .delete(deleteContactById);

module.exports = router;