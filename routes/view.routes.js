const express = require('express');
const viewControllers = require('../controllers/view.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get(
  '/:profileId',
  authen,
  validateProfile,
  viewControllers.getViewProfile
);

module.exports = router;
