const { throwError } = require('../functions/throwError');
const { getView } = require('../functions/getView');
const db = require('../models/index');

const useLink = async (req, res, next) => {
  const linkId = req.params.linkId;
  let profileId;

  await db.Profile.findOne({ where: { linkId: linkId } })
    .then((profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบ link นี้', {
          linkId: linkId,
        });
      } else if (profile.show !== 'enable') {
        throwError(403, 'link นี้ไม่สามารถเข้าถึงได้', {
          linkId: linkId,
        });
      }
      profileId = profile.id;
    })
    .catch((error) => {
      next(error);
    });

  try {
    const view = await getView(profileId);
    return res.status(200).json(view);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  useLink,
};
