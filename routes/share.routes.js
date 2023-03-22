const express = require('express');
const shareControllers = require('../controllers/share.controllers');

const router = express.Router();

router.get('/link/:linkId', shareControllers.useLink);

module.exports = router;
