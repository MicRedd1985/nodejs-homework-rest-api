const fs = require('fs').promises
const path = require('path')
const shortid = require('shortid')

const contactsPath = path.join("models", "contacts.json")

async function readData() {
  try {
    const contacts = await fs.readFile(contactsPath)
    return JSON.parse(contacts)
  } catch (err) {
    console.log(err.message)
  }
};

async function writeData(data) {
  const stringifiedData = JSON.stringify(data)
  try {
    await fs.writeFile(contactsPath, stringifiedData)
  } catch (err) {
    console.log(err.message)
  }
}

const listContacts = async () => {
  try {
    const contacts = await readData();
    return contacts;
  } catch (err) {
    console.log(err.message)
  }
}

const getContactById = async (contactId) => {
  try {
    const allContacts = await readData()
    const [contact] = allContacts.filter(contact => contact.id === contactId);
    return contact;
  } catch (err) {
    console.log(err.message)
  }
}

const addContact = async (body) => {
  const { name, email, phone } = body;
  const newContact = {
    id: shortid.generate(),
    name,
    email,
    phone,
  }
  try {
    const allContacts = await readData();
    const upgradeContacts = [...allContacts, newContact];
    await writeData(upgradeContacts)
    return newContact
  } catch (err) {
    console.log(err.message)
  }
}

const removeContact = async (contactId) => {
  try {
    const allContacts = await readData();
    const updatedContacts = allContacts.filter(contact => contact.id !== contactId);
    await writeData(updatedContacts)
  } catch (err) {
    console.log(err.message)
  }
}

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  try {
    const allContacts = await readData();
    const updatedContact = allContacts.map(contact => {
      if (contactId === contact.id) {
        contact = {
          id: contactId,
          name,
          email,
          phone,
        };
      }
      return contact;
    })
    await writeData(updatedContact)
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}