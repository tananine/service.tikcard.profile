const { throwError } = require('../functions/throwError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) {
    throwError(401, 'ยืนยันตัวตนไม่สำเร็จ');
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
    if (!decodedToken) {
      throwError(401, 'ยืนยันตัวตนไม่สำเร็จ');
    }
    req.account = decodedToken;
    next();
  } catch (error) {
    throwError(401, 'ยืนยันตัวตนไม่สำเร็จ', error);
    next();
  }
};
