const { throwError } = require('../functions/throwError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    throwError(401, 'ยืนยันตัวตนไม่สำเร็จ', {}, false);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SERVICE_PROFILE_SECRET_KEY);
    if (!decodedToken) {
      throwError(401, 'ยืนยันตัวตนไม่สำเร็จ', {}, false);
    }
    req.account = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    throwError(401, 'ยืนยันตัวตนไม่สำเร็จ', error, false);
    next();
  }
};
