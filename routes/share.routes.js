const express = require('express');
const shareControllers = require('../controllers/share.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const { body } = require('express-validator');

const router = express.Router();

router.get('/link/:linkId', shareControllers.useLink);
router.post(
  '/update',
  authen,
  validateProfile,
  [
    body('linkId')
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage('โปรดป้อนข้อมูล')
      .isLength({ min: 4, max: 12 })
      .withMessage('ต้องมีความยาว 4 ถึง 12 อักขระ')
      .matches('^[A-Za-z0-9_]+$')
      .withMessage('ต้องเป็นอักษร a-z , 0-9 หรือ _ (Apostrophe)'),
  ],
  shareControllers.updateLink
);
router.get('/get', authen, validateProfile, shareControllers.getLink);

router.get('/primary-link', authen, shareControllers.getPrimaryLink);
router.get('/secondary-link', authen, shareControllers.getSecondaryLink);

module.exports = router;
