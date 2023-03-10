const express = require('express');
const activationControllers = require('../controllers/activation.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/', authen, activationControllers.getProfileActivation);
router.put(
  '/primary/:profileId',
  authen,
  validateProfile,
  activationControllers.setPrimaryProfile
);
router.put(
  '/secondary/:profileId',
  authen,
  validateProfile,
  activationControllers.setSecondaryProfile
);

module.exports = router;
