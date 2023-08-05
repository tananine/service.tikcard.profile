const { validationResult } = require('express-validator');
const { throwError } = require('../functions/throwError');
const { getView } = require('../functions/getView');
const db = require('../models/index');

const useLink = async (req, res, next) => {
  const linkId = req.params.linkId;
  let profileId;

  await db.Profile.findOne({ where: { linkId: linkId } })
    .then((profile) => {
      if (!profile) {
        throwError(
          404,
          'ไม่พบ link นี้',
          {
            linkId: linkId,
          },
          false
        );
      } else if (profile.show !== 'enable') {
        throwError(
          403,
          'link นี้ไม่สามารถเข้าถึงได้',
          {
            linkId: linkId,
          },
          false
        );
      }
      profileId = profile.id;
    })
    .catch((error) => {
      next(error);
    });

  if (profileId) {
    try {
      const view = await getView(profileId);
      return res.status(200).json(view);
    } catch (error) {
      next(error);
    }
  }
};

const updateLink = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError(400, errors.array()[0].msg, errors.array(), true);
  }

  const profileId = req.headers.profile;
  const linkId = req.body.linkId;

  db.Profile.findOne({ where: { linkId: linkId } })
    .then((profile) => {
      if (profile) {
        throwError(400, 'link ID นี้ถูกใช้งานแล้ว', { linkId: linkId }, true);
      }
    })
    .catch((error) => {
      next(error);
    });

  db.Profile.update({ linkId: linkId }, { where: { id: profileId } })
    .then((isUpdate) => {
      if (!isUpdate[0]) {
        throwError(
          400,
          'อัพเดทไม่สำเร็จ',
          {
            profileId: profileId,
            linkId: linkId,
          },
          false
        );
      }
      return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
    })
    .catch((error) => {
      next(error);
    });
};

const getLink = (req, res, next) => {
  const profileId = req.headers.profile;

  db.Profile.findOne({ where: { id: profileId } })
    .then((profile) => {
      return res
        .status(200)
        .json({ linkId: profile.linkId, show: profile.show });
    })
    .catch((error) => {
      next(error);
    });
};

const getPrimaryLink = (req, res, next) => {
  const accountId = req.account.id;

  db.Activation.findOne({
    where: { accountId: accountId },
    include: [{ model: db.Profile, as: 'profilePrimary' }],
  })
    .then((activation) => {
      if (!activation) {
        throwError(
          404,
          'ไม่พบข้อมูล',
          {
            accountId: accountId,
          },
          false
        );
      }

      const linkId = activation.profilePrimary?.linkId;
      if (linkId) {
        return res.status(200).json({ linkId: linkId });
      } else {
        throwError(
          404,
          'ไม่พบ linkId',
          {
            accountId: accountId,
            noProfile: true,
          },
          false
        );
      }
    })
    .catch((error) => {
      next(error);
    });
};

const getSecondaryLink = (req, res, next) => {
  const accountId = req.account.id;

  db.Activation.findOne({
    where: { accountId: accountId },
    include: [{ model: db.Profile, as: 'profileSecondary' }],
  })
    .then((activation) => {
      if (!activation) {
        throwError(
          404,
          'ไม่พบข้อมูล',
          {
            accountId: accountId,
          },
          false
        );
      }

      const linkId = activation.profileSecondary?.linkId;
      if (linkId) {
        return res.status(200).json({ linkId: linkId });
      } else {
        getPrimaryLink(req, res, next);
      }
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  useLink,
  updateLink,
  getLink,
  getPrimaryLink,
  getSecondaryLink,
};
