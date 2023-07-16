const express = require('express');
const profileControllers = require('../controllers/profile.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const { body } = require('express-validator');

const router = express.Router();

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
});

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const multer = require('multer');
const multerS3 = require('multer-s3');
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      if (file.fieldname === 'profileImage') {
        cb(null, 'uploads/profileImages/' + Date.now().toString());
      } else if (file.fieldname === 'logoImage') {
        cb(null, 'uploads/logoImages/' + Date.now().toString());
      } else {
        cb(new Error('Invalid fieldname'));
      }
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('File is not allowed'));
    }
    cb(null, true);
  },
});

router.get('/', authen, profileControllers.getProfileSoft);
router.post(
  '/',
  authen,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
  ]),
  [
    body('cardName')
      .trim()
      .notEmpty()
      .withMessage('โปรดป้อนชื่อเรียกนามบัตร')
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('name')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('job')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('company')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('bio1')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
    body('bio2')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
    body('bio3')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
  ],
  profileControllers.addProfile
);
router.delete(
  '/:profileId',
  authen,
  validateProfile,
  profileControllers.removeProfile
);
router.get(
  '/information',
  authen,
  validateProfile,
  profileControllers.getInformation
);
router.put(
  '/information',
  authen,
  validateProfile,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
  ]),
  [
    body('cardName')
      .trim()
      .notEmpty()
      .withMessage('โปรดป้อนชื่อเรียกนามบัตร')
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('name')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('job')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('company')
      .trim()
      .isLength({ max: 50 })
      .withMessage('ต้องมีความยาวไม่เกิน 50 อักขระ'),
    body('bio1')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
    body('bio2')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
    body('bio3')
      .trim()
      .isLength({ max: 80 })
      .withMessage('ต้องมีความยาวไม่เกิน 80 อักขระ'),
  ],
  profileControllers.updateInformation
);

module.exports = router;
