const { throwError } = require('../functions/throwError');
const db = require('../models/index');

const sendContact = async (req, res, next) => {
  const profileId = req.body.profileId;
  const name = req.body.name;
  const phone = req.body.phone || null;
  const email = req.body.email;
  const message = req.body.message;

  try {
    const createConnection = await db.Connection.create({
      profileId: profileId,
      name: name,
      phone: phone,
      email: email,
      message: message,
    });
    await createConnection.save();
    return res.status(200).json('ส่งสำเร็จ');
  } catch (error) {
    next(error);
  }
};

const getAllConnectList = (req, res, next) => {
  const accountId = req.account.id;

  db.Profile.findAll({
    where: { accountId: accountId },
    include: [
      { model: db.Connection },
      { model: db.Info, attributes: ['profileImage', 'logoImage'] },
    ],
    attributes: ['id', 'name'],
  })
    .then((profiles) => {
      return res.status(200).json(profiles);
    })
    .catch((error) => {
      next(error);
    });
};

const deleteConnectList = (req, res, next) => {
  const profileId = req.params.profileId;
  const connectionId = req.params.connectionId;

  db.Connection.destroy({
    where: { id: connectionId, profileId: profileId },
  })
    .then((isDestroy) => {
      if (!isDestroy) {
        throwError(
          404,
          'ไม่พบข้อมูล',
          {
            profileId: profileId,
            connectionId: connectionId,
          },
          false
        );
      }
      return res.status(200).json({ message: 'ลบสำเร็จ' });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  sendContact,
  getAllConnectList,
  deleteConnectList,
};
