const express = require('express');
const contactControllers = require('../controllers/contact.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/', authen, validateProfile, contactControllers.getContactList);
router.get(
  '/me/list',
  authen,
  validateProfile,
  contactControllers.getMyContact
);
router.post('/me/app', authen, validateProfile, contactControllers.addContact);
router.put(
  '/me/app',
  authen,
  validateProfile,
  contactControllers.updateContact
);
router.delete(
  '/me/app/:contactId',
  authen,
  validateProfile,
  contactControllers.deleteContact
);
router.put(
  '/me/toggle',
  authen,
  validateProfile,
  contactControllers.toggleEnable
);
router.put('/me/sort', authen, validateProfile, contactControllers.updateSort);

module.exports = router;
