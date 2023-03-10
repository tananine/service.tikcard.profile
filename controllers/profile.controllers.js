const { throwError } = require('../functions/throwError');
const db = require('../models/index');

const getProfileSoft = (req, res, next) => {
  const accountId = req.account.id;

  const mapData = (array) =>
    array.map((item) => {
      return {
        profileId: item.id,
        profileName: item.name,
        sort: item.sort,
        name: item.Info.name,
        company: item.Info.company,
      };
    });

  db.Profile.findAll({
    where: { accountId: accountId },
    include: { model: db.Info },
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

  const profileName = req.body.profileName;
  const name = req.body.name;
  const bio = req.body.bio;
  const work = req.body.work;
  const company = req.body.company;
  const position = req.body.position;
  const address = req.body.address;

  try {
    const createProfile = await db.Profile.create(
      {
        accountId: accountId,
        name: profileName,
        status: 'personal',
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
    return res.status(200).json({ message: 'สร้าง Profile สำเร็จ' });
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
    .then((isDestroy) => {
      if (isDestroy) {
        return res.status(200).json({ message: 'ลบสำเร็จ' });
      }
      throwError(404, 'ไม่พบข้อมูล', {
        accountId: accountId,
        profileId: profileId,
      });
    })
    .catch((error) => {
      next(error);
    });
};

const getInformation = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profile;
  db.Profile.findOne({
    where: { id: profileId, accountId: accountId },
    include: { model: db.Info },
  })
    .then((profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      const Information = profile.Info;
      return res.status(200).json({
        profileName: profile.name,
        name: Information.name,
        bio: Information.bio,
        work: Information.work,
        company: Information.company,
        position: Information.position,
        address: Information.address,
      });
    })
    .catch((error) => {
      next(error);
    });
};

const updateInformation = async (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profile;

  const profileName = req.body.profileName;
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
      await db.Profile.update(
        {
          name: profileName,
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
      return transaction.commit();
    })
    .catch(async (error) => {
      await transaction.rollback();
      next(error);
    });
};

module.exports = {
  getProfileSoft,
  addProfile,
  removeProfile,
  getInformation,
  updateInformation,
};
