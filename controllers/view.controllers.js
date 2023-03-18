const { throwError } = require('../functions/throwError');
const {
  getArrayContactIncludeContactItem,
} = require('../functions/getArrayContact');
const db = require('../models/index');

const getViewProfile = async (req, res, next) => {
  const profileId = req.params.profileId;
  let info = null;
  let contacts = [];

  await db.Info.findOne({
    where: { profileId: profileId },
  })
    .then((infoData) => {
      if (!infoData) {
        throwError(404, 'ไม่พบ Info', {
          profileId: profileId,
        });
      }
      info = infoData;
    })
    .catch((error) => {
      next(error);
    });

  try {
    contacts = await getArrayContactIncludeContactItem(profileId);
    return res.status(200).json({ info: info, contacts: contacts });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getViewProfile,
};
