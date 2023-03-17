const shortid = require('shortid')

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

getContactsList = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;


    const newClient = {
      id: shortid.generate(),
      name,
      email,
      phone,
    };

    await addContact(newClient);

    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ message: "missing required name field" });
  }
};

getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getById(id);

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await updateContact(id, req.body);

    res.status(200).json(req.body);
  } catch (error) {
    next(error);
  }
};

deleteContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await removeContact(id);

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsList,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
};