const express = require('express');
const profileControllers = require('../controllers/profile.controllers');
const authen = require('../middleware/authen');
const validateProfile = require('../middleware/validateProfile');

const router = express.Router();

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: process.env.S3_ENDPOINT,
});

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
});

router.get('/', authen, profileControllers.getProfileSoft);
router.post(
  '/',
  authen,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
  ]),
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
  profileControllers.updateInformation
);

module.exports = router;
