const express = require('express');
const viewControllers = require('../controllers/view.controllers');

const router = express.Router();

router.get('/', viewControllers.getViewProfile);

module.exports = router;
