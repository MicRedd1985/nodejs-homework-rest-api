const express = require('express');


const {
  getContactsList,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
  updateStatusContactById,
} = require("../../controllers/contacts");

const {
  checkContactId,
  checkClientData,
  requestValidation,
  checkStatusData,
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
  .put(checkClientData, validateClientData, updateContactById)
  .delete(deleteContactById);

router
  .route("/:contactId/favorite")
  .patch(checkStatusData, updateStatusContactById);

module.exports = router;