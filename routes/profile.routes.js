const express = require('express');
const profileControllers = require('../controllers/profile.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/', authen, profileControllers.getProfileSoft);
router.post('/', authen, profileControllers.addProfile);
router.delete(
  '/:profileId',
  authen,
  validateProfile,
  profileControllers.removeProfile
);
router.get(
  '/Information',
  authen,
  validateProfile,
  profileControllers.getInformation
);
router.put(
  '/Information',
  authen,
  validateProfile,
  profileControllers.updateInformation
);

module.exports = router;
