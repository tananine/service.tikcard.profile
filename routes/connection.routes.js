const express = require('express');
const connectionControllers = require('../controllers/connection.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const { body } = require('express-validator');

const router = express.Router();

router.post(
  '/send-contact',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('โปรดป้อนข้อมูล')
      .isLength({ max: 50 })
      .withMessage('ชื่อต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('โปรดป้อนข้อมูล')
      .isLength({ max: 25 })
      .withMessage('เบอร์โทรต้องมีความยาวไม่เกิน 25'),
    body('email')
      .trim()
      .isLength({ max: 80 })
      .withMessage('อีเมลต้องมีความยาวไม่เกิน 80 อักขระ'),
    body('message')
      .trim()
      .isLength({ max: 250 })
      .withMessage('ข้อความต้องมีความยาวไม่เกิน 250 อักขระ'),
  ],
  connectionControllers.sendContact
);
router.get(
  '/get-all-connect-list',
  authen,
  validateProfile,
  connectionControllers.getAllConnectList
);
router.delete(
  '/delete-connect-list/:profileId/:connectionId',
  authen,
  validateProfile,
  connectionControllers.deleteConnectList
);

module.exports = router;
