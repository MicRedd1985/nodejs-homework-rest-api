const { Conflict, Unauthorized, AppError, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { User, joiSubscriptionSchema } = require("../models");
const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");


const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`${email} already in use`);
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({ user: {email, subscription: result.subscription}});
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized(`Email or password invalid`);
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
    const avatarURL = path.join("avatar", resultUpload);

    await User.findByIdAndUpdate(id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar
};