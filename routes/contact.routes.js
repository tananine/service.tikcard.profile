const express = require('express');
const contactControllers = require('../controllers/contact.controllers');
const authen = require('../middleware/authen');

const router = express.Router();

router.get('/', authen, contactControllers.getContactList);
router.get('/me/list', authen, contactControllers.getMyContact);
router.post('/me/app', authen, contactControllers.addContact);
router.put('/me/app', authen, contactControllers.updateContact);
router.delete('/me/app/:contactId', authen, contactControllers.deleteContact);
router.put('/me/toggle', authen, contactControllers.toggleEnable);
router.put('/me/sort', authen, contactControllers.updateSort);

module.exports = router;
