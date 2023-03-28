const Contact = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");

getContactsList = catchAsync(async (req, res) => {
  const contacts = await Contact.find();

  res.status(200).json(contacts);
});

createContact = catchAsync(async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  const newContact = await Contact.create({
    name,
    email,
    phone,
    favorite,
  });

  res.status(201).json({ contact: newContact });
});

getContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);

  res.status(200).json(contact);
});

updateContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  const updateContact = await Contact.findByIdAndUpdate(
    id,
    { name, email, phone, favorite },
    { new: true }
  );

  res.status(200).json(updateContact);
});

updateStatusContactById = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const updateContact = await updateStatusContact(contactId, req.body);

  res.status(200).json(updateContact);
});

const updateStatusContact = async (contactId, body) => {
  const updateContact = await Contact.findByIdAndUpdate(contactId, body, { new: true });

  return updateContact;
}


deleteContactById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Contact.findByIdAndRemove(id);

  res.status(200).json({ message: "contact deleted" });
});

module.exports = {
  getContactsList,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
  updateStatusContactById,
};