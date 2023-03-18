const fs = require('fs').promises

const listContacts = async () => {
  return JSON.parse(await fs.readFile("./models/contacts.json"));
};

const getById = async (id) => {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === id);

  return contact;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const updatedContacts = contacts.filter(item => item.id !== id);

  await fs.writeFile("./models/contacts.json", JSON.stringify(updatedContacts));
};

const addContact = async (body) => {
  const contacts = await listContacts();

  contacts.push(body);

  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
};

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const contactSearch = contacts.findIndex((item) => item.id === id);
  const { name, email, phone } = body;

  contacts[contactSearch] = { id, name, email, phone };

  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};