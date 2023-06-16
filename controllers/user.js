const { Conflict, Unauthorized, AppError, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const uuid = require("uuid").v4;
const fs = require("fs/promises");
const { User, joiSubscriptionSchema } = require("../models");
const { SECRET_KEY, EMAIL_FROM } = process.env;
const { sendEmail } = require ("../helpers")

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} already in use`);
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const verificationToken = uuid();
  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: "Confirmation of registration on the website",
    html:
      "<h3>Please complete registration: confirm you email </h3>" +
      `<h4>
          <a href='http://localhost:3000/api/users/verify/${verificationToken}'>
            by click on this link
          </a>
        </h4>`,
  };
  await sendEmail(msg);

  res.status(201).json({ user: {email, subscription: result.subscription}});
};



const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized(`Email is wrong or not verify, or password is wrong`);
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({ token, user: {email: user.email, subscription: user.subscription} });
};

const getCurrent = async (req, res) => {
  const { email,subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({ message: "user logout!" });
};

const updateStatusUser = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  const { error } = joiSubscriptionSchema.validate({ subscription });

  if (error) {
    throw new AppError(400, "missing field subscription");
  }

  const result = await User.findByIdAndUpdate(id, { subscription }, { new: true });

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ result });
};

const updateAvatar = async (req, res) => {
  try {
    const { path: temporaryName, filename } = req.file;
    const { id } = req.user;
    const [extention] = filename.split(".").reverse();
    const avatarName = `${id}.${extention}`;

    const resultUpload = path.join(avatarsDir, avatarName);

    await Jimp.read(temporaryName)
      .then((img) => {
        return img.resize(250, 250).writeAsync(temporaryName);
      })
      .catch((error) => {
        console.log(error);
      });

    await fs.rename(temporaryName, resultUpload);
    const avatarURL = path.join("avatars", avatarName);

    await User.findByIdAndUpdate(id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw notFound();
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  
  res.json({ message: "Verification successful" });
};

const verifyUserControler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!email) {
    res.status(400).json({ message: "missing required field email" });
  }

  if (user.verify) {
    res.status(400).json({ message: "Verification has already been passed" });
  }

  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: "Verification email (dublicate)",
    text: "please open in browser, that support html messages view",
    html:
      "<h3>Please complete registration: confirm you email </h3>" +
      `<h4>
          <a href='http://localhost:3000/api/users/verify/${user.verificationToken}'>
            by click on this link
          </a>
        </h4>`,
  };

  await sendEmail(msg);
  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
  verifyEmail,
  verifyUserControler
};