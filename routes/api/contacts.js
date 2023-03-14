const express = require('express');
const { requestValidation } = require('../middlewares/validation');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact
} = require('../../models/contacts')

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contacts = await listContacts(req.params.contactId);
  res.json({ contacts })
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params.contactId)
  if (contact === undefined) {
    return res.status(404).json({ message: 'Not found' })
  }
  res.status(200).json({ contact })
})

router.post('/', requestValidation, async (req, res, next) => {
  const contact = await addContact(req.body);
  res.status(201).json({ contact })
})

router.delete('/:contactId', async (req, res, next) => {
  if ((await getContactById(req.params.contactId)) === undefined) {
    return res.status(404).json({ message: 'Not found' })
  }
  await removeContact(req.params.contactId)
  res.status(200).json({ message: 'Contact deleted' })
})

router.put('/:contactId', requestValidation, async (req, res, next) => {

  if ((await getContactById(req.params.contactId)) === undefined) {
    return res.status(404).json({ message: 'Not found' })
  }

  await updateContact(req.params.contactId, req.body);
  const contact = await getContactById(req.params.contactId)
  res.status(200).json({ contact })
})

module.exports = router