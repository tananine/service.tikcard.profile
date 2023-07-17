const express = require('express');
const contactControllers = require('../controllers/contact.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const { body } = require('express-validator');

const router = express.Router();

router.get('/', authen, contactControllers.getAllContactAppList);
router.get(
  '/me/list',
  authen,
  validateProfile,
  contactControllers.getMyContact
);
router.post(
  '/me/app',
  authen,
  validateProfile,
  [
    body('data')
      .trim()
      .isLength({ max: 250 })
      .withMessage('ข้อมูลต้องไม่เกิน 250 ตัวอักษร'),
    body('name')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ชื่อต้องไม่เกิน 50 ตัวอักษร'),
    body('note')
      .trim()
      .isLength({ max: 150 })
      .withMessage('รายละเอียดต้องไม่เกิน 150 ตัวอักษร'),
    body('latitude')
      .trim()
      .isFloat({ min: -190, max: 190 })
      .optional({ nullable: true })
      .withMessage('latitude ต้องเป็น -190 ถึง 190 เท่านั้น'),
    body('longitude')
      .trim()
      .isFloat({ min: -190, max: 190 })
      .optional({ nullable: true })
      .withMessage('longitude ต้องเป็น -190 ถึง 190 เท่านั้น'),
  ],
  contactControllers.addContact
);
router.put(
  '/me/app',
  authen,
  validateProfile,
  [
    body('data')
      .trim()
      .notEmpty()
      .withMessage('โปรดป้อนข้อมูล')
      .isLength({ max: 250 })
      .withMessage('ข้อมูลต้องไม่เกิน 250 ตัวอักษร'),
    body('name')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ชื่อต้องไม่เกิน 50 ตัวอักษร'),
    body('note')
      .trim()
      .isLength({ max: 150 })
      .withMessage('รายละเอียดต้องไม่เกิน 150 ตัวอักษร'),
    body('latitude')
      .trim()
      .isFloat({ min: -190, max: 190 })
      .optional({ nullable: true })
      .withMessage('latitude ต้องไม่เกิน -190 ถึง 190'),
    body('longitude')
      .trim()
      .isFloat({ min: -190, max: 190 })
      .optional({ nullable: true })
      .withMessage('longitude ต้องไม่เกิน -190 ถึง 190'),
  ],
  contactControllers.updateContact
);
router.delete(
  '/me/app/:contactId',
  authen,
  validateProfile,
  contactControllers.deleteContact
);
router.put(
  '/me/toggle',
  authen,
  validateProfile,
  contactControllers.toggleEnable
);
router.put('/me/sort', authen, validateProfile, contactControllers.updateSort);

module.exports = router;
