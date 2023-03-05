const express = require('express');
const profileControllers = require('../controllers/profile.controllers');
const authen = require('../middleware/authen');

const router = express.Router();

router.get('/', authen, profileControllers.getProfileSoft);
router.post('/', authen, profileControllers.addProfile);
router.delete('/:profileId', authen, profileControllers.removeProfile);
router.get('/Information', authen, profileControllers.getInformation);
router.put('/Information', authen, profileControllers.updateInformation);

module.exports = router;
