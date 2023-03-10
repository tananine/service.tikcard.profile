const { throwError } = require('../functions/throwError');
const db = require('../models/index');

module.exports = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profile || req.params.profileId;

  db.Profile.findOne({
    where: { id: profileId, accountId: accountId },
  })
    .then(async (profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      next();
    })
    .catch(async (error) => {
      next(error);
    });
};
