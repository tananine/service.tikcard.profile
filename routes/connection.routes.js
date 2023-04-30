const express = require('express');
const connectionControllers = require('../controllers/connection.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.post('/send-contact', connectionControllers.sendContact);
router.get(
  '/get-all-connect-list',
  authen,
  validateProfile,
  connectionControllers.getAllConnectList
);
router.delete(
  '/delete-connect-list/:profileId/:connectionId',
  authen,
  validateProfile,
  connectionControllers.deleteConnectList
);

module.exports = router;
