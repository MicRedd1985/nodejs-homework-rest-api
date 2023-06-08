const express = require("express");
const { validationUser, user } = require("../../middlewares/index");
const { ctrlWrapper } = require("../../utils");
const { joiRegisterSchema, joiLoginSchema, joiSubscriptionSchema } = require("../../models/user");
const {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
} = require("../../controllers/user");

const router = express.Router();

router.post("/register", validationUser (joiRegisterSchema), ctrlWrapper(register));
router.post("/login", validationUser(joiLoginSchema), ctrlWrapper(login));
router.get("/current", user, ctrlWrapper(getCurrent));
router.post("/logout", user, ctrlWrapper(logout));
router.patch("/", validationUser (joiSubscriptionSchema), ctrlWrapper(updateStatusUser));

module.exports = router;