const express = require('express');
const activationControllers = require('../controllers/activation.controllers');
const authen = require('../middleware/authen');

const router = express.Router();

router.get('/', authen, activationControllers.getProfileActivation);
router.put(
  '/primary/:profileId',
  authen,
  activationControllers.setPrimaryProfile
);
router.put(
  '/secondary/:profileId',
  authen,
  activationControllers.setSecondaryProfile
);

module.exports = router;
