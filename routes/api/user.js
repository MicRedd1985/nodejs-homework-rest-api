const express = require("express");
const { validationUser, user, upload } = require("../../middlewares/index");
const { ctrlWrapper } = require("../../utils");
const { joiRegisterSchema, joiLoginSchema, joiSubscriptionSchema } = require("../../models/user");
const {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
} = require("../../controllers/user");

const router = express.Router();

router.post("/register", validationUser (joiRegisterSchema), ctrlWrapper(register));
router.post("/login", validationUser(joiLoginSchema), ctrlWrapper(login));
router.get("/current", user, ctrlWrapper(getCurrent));
router.post("/logout", user, ctrlWrapper(logout));
router.patch("/", validationUser (joiSubscriptionSchema), ctrlWrapper(updateStatusUser));
router.patch("/avatars",  user,  upload.single("avatar"), ctrlWrapper(updateAvatar));

module.exports = router;