const { joiSchema, favoriteSchema, Contact } = require("../models/contact");
const { NotFound } = require("http-errors");
const { AppError } = require("../utils/AppError");


const getContactsList = async (req, res) => {
  const { _id } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner: _id }, "",
    { skip, 
      limit: Number(limit) 
    }).populate("owner", "_id name email");
  res.status(200).json(result);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json(result);
};

const createContact = async (req, res) => {
  const { _id } = req.user;
  const body = req.body;
  const result = await Contact.create({ ...body, owner: _id});
  res.status(201).json(result);
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const body = req.body;
  const { error } = joiSchema.validate(body);

  if (error) {
    throw new AppError(400, `missing fields`);
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { error } = favoriteSchema.validate({ favorite });

  if (error) {
    throw new AppError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json(result);
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);

  if (!result) {
    throw new NotFound(`Not found!`);
  }
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getContactsList,
  getContactById,
  createContact,
  updateContactById,
  updateStatusContact,
  deleteContactById,
};