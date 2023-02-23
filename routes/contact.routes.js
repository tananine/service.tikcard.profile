const express = require('express');
const contactControllers = require('../controllers/contact.controllers');
const authen = require('../middleware/authen');

const router = express.Router();

router.get('/', authen, contactControllers.getContactList);
router.get('/me/list/:profileId', authen, contactControllers.getMyContact);
router.post('/me/app', authen, contactControllers.addContact);
router.put('/me/app', authen, contactControllers.updateContact);
router.delete('/me/app', authen, contactControllers.deleteContact);
router.put('/me/toggle/:contactId', authen, contactControllers.toggleEnable);
router.put('/me/sort/:profileId', authen, contactControllers.updateSort);

module.exports = router;
