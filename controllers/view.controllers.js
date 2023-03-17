const { throwError } = require('../functions/throwError');
const { getArrayContact } = require('../functions/getArrayContact');
const db = require('../models/index');

const getViewProfile = async (req, res, next) => {
  const profileId = req.params.profileId;
  let profile = null;
  let contacts = [];

  await db.Profile.findOne({
    where: { id: profileId },
    include: { model: db.Info },
  })
    .then((profileData) => {
      if (!profileData) {
        throwError(404, 'ไม่มีพบ Profile', {
          profileId: profileId,
        });
      }
      profile = profileData;
    })
    .catch((error) => {
      next(error);
    });

  try {
    contacts = await getArrayContact(profileId);
    return res.status(200).json({ profile: profile, contacts: contacts });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getViewProfile,
};
