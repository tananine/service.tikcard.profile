const { throwError } = require('../functions/throwError');
const {
  getArrayContactIncludeContactItem,
} = require('../functions/getArrayContact');
const db = require('../models/index');

exports.getView = async (profileId) => {
  let info = null;
  let contacts = [];

  await db.Info.findOne({
    where: { profileId: profileId },
    include: { model: db.Profile, attributes: ['coverImage'] },
  })
    .then((infoData) => {
      if (!infoData) {
        throwError(
          404,
          'ไม่พบ Info',
          {
            profileId: profileId,
          },
          false
        );
      }
      info = infoData;
    })
    .catch((error) => {
      throw error;
    });

  contacts = await getArrayContactIncludeContactItem(profileId);
  contacts = contacts.filter((contact) => contact.show === 'enable');
  return { info: info, contacts: contacts };
};
