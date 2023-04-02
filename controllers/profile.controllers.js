const { throwError } = require('../functions/throwError');
const randomKey = require('random-key');
const db = require('../models/index');

const getProfileSoft = (req, res, next) => {
  const accountId = req.account.id;

  const mapData = (array) =>
    array.map((item) => {
      return {
        profileId: item.id,
        cardName: item.name,
        sort: item.sort,
        name: item.Info.name,
        company: item.Info.company,
      };
    });

  db.Profile.findAll({
    where: { accountId: accountId },
    include: { model: db.Info },
    order: [['createdAt', 'ASC']],
  })
    .then((profiles) => {
      return res.status(200).json(mapData(profiles));
    })
    .catch((error) => {
      next(error);
    });
};

const addProfile = async (req, res, next) => {
  const accountId = req.account.id;

  const cardName = req.body.cardName;
  const name = req.body.name;
  const bio = req.body.bio;
  const work = req.body.work;
  const company = req.body.company;
  const position = req.body.position;
  const address = req.body.address;

  const randomKeyHandler = () => {
    return randomKey.generate(7);
  };

  let linkIdGenerate = randomKeyHandler();
  let linkIdInUse = false;

  try {
    do {
      linkIdInUse = false;
      await db.Profile.findOne({ where: { linkId: linkIdGenerate } }).then(
        (profile) => {
          if (profile) {
            linkIdInUse = true;
            linkIdGenerate = randomKeyHandler();
          }
        }
      );
    } while (linkIdInUse);

    const createProfile = await db.Profile.create(
      {
        accountId: accountId,
        name: cardName,
        linkId: linkIdGenerate,
        show: 'enable',
        Info: {
          name: name,
          bio: bio,
          work: work,
          company: company,
          position: position,
          address: address,
        },
      },
      { include: { model: db.Info } }
    );
    await createProfile.save();
    return res.status(200).json({
      message: 'สร้าง Profile สำเร็จ',
      returnData: { id: createProfile.id },
    });
  } catch (error) {
    next(error);
  }
};

const removeProfile = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.params.profileId;

  db.Profile.destroy({
    where: { id: profileId, accountId: accountId },
    include: { model: db.Info },
  })
    .then(() => {
      return res.status(200).json({ message: 'ลบสำเร็จ' });
    })
    .catch((error) => {
      next(error);
    });
};

const getInformation = (req, res, next) => {
  const profileId = req.headers.profile;

  db.Info.findOne({
    where: { profileId: profileId },
    include: { model: db.Profile },
  })
    .then((info) => {
      if (!info) {
        throwError(404, 'ไม่มีข้อมูล Info', {
          profileId: profileId,
        });
      }

      return res.status(200).json({
        cardName: info.Profile.name,
        name: info.name,
        bio: info.bio,
        work: info.work,
        company: info.company,
        position: info.position,
        address: info.address,
      });
    })
    .catch((error) => {
      next(error);
    });
};

const updateInformation = async (req, res, next) => {
  const profileId = req.headers.profile;

  const cardName = req.body.cardName;
  const name = req.body.name;
  const bio = req.body.bio;
  const work = req.body.work;
  const company = req.body.company;
  const position = req.body.position;
  const address = req.body.address;

  const transaction = await db.sequelize.transaction();
  transaction.afterCommit(() => {
    return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
  });

  try {
    await db.Profile.update(
      {
        name: cardName,
      },
      {
        where: { id: profileId },
        transaction: transaction,
      }
    );
    await db.Info.update(
      {
        name: name,
        bio: bio,
        work: work,
        company: company,
        position: position,
        address: address,
      },
      {
        where: { profileId: profileId },
        transaction: transaction,
      }
    );
    transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getProfileSoft,
  addProfile,
  removeProfile,
  getInformation,
  updateInformation,
};
