const { throwError } = require('../functions/throwError');
const db = require('../models/index');

const getProfileActivation = (req, res, next) => {
  const accountId = req.account.id;
  const email = req.account.email;
  db.Activation.findOne({ where: { accountId: accountId } })
    .then(async (activation) => {
      if (!activation) {
        const createActivation = await db.Activation.create({
          accountId: accountId,
        });
        await createActivation.save();
        return res.status(200).json(createActivation);
      }
      return res.status(200).json({
        activation: activation,
        account: {
          email: email,
        },
      });
    })
    .catch((error) => {
      next(error);
    });
};

const setPrimaryProfile = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.params.profileId;

  db.Activation.update(
    { primary: profileId },
    { where: { accountId: accountId } }
  )
    .then((isUpdate) => {
      if (!isUpdate[0]) {
        throwError(400, 'อัพเดทไม่สำเร็จ', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
    })
    .catch((error) => {
      next(error);
    });
};

const setSecondaryProfile = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.params.profileId;

  db.Activation.update(
    { secondary: profileId },
    { where: { accountId: accountId } }
  )
    .then((isUpdate) => {
      if (!isUpdate[0]) {
        throwError(400, 'อัพเดทไม่สำเร็จ', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getProfileActivation,
  setPrimaryProfile,
  setSecondaryProfile,
};
