const express = require('express');
const shareControllers = require('../controllers/share.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

router.get('/link/:linkId', shareControllers.useLink);
router.post('/update', authen, validateProfile, shareControllers.updateLink);
router.get('/get', authen, validateProfile, shareControllers.getLink);

module.exports = router;
