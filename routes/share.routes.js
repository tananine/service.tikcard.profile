const express = require('express');
const shareControllers = require('../controllers/share.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/link/:linkId', shareControllers.useLink);
router.post('/update', authen, validateProfile, shareControllers.updateLink);
router.get('/get', authen, validateProfile, shareControllers.getLink);

router.get('/primary-link', authen, shareControllers.getPrimaryLink);
router.get('/secondary-link', authen, shareControllers.getSecondaryLink);

module.exports = router;
