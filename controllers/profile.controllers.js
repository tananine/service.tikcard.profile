const { validationResult } = require('express-validator');
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
        job: item.Info.job,
        company: item.Info.company,
        profileImage: item.Info.profileImage,
        logoImage: item.Info.logoImage,
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
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError(400, errors.array()[0].msg, errors.array(), true);
    }

    const accountId = req.account.id;

    const cardName = req.body.cardName || '';
    const name = req.body.name || '';
    const job = req.body.job || '';
    const company = req.body.company || '';
    const bio1 = req.body.bio1 || '';
    const bio2 = req.body.bio2 || '';
    const bio3 = req.body.bio3 || '';

    const profileImage = req.files?.['profileImage']?.[0];
    const logoImage = req.files?.['logoImage']?.[0];

    const randomKeyHandler = () => {
      return randomKey.generate(12);
    };

    let linkIdGenerate = randomKeyHandler().toLowerCase();
    let linkIdInUse = false;

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
        coverImage: 1,
        colorCoverImage: 1,
        linkId: linkIdGenerate,
        show: 'enable',
        Info: {
          name: name,
          job: job,
          company: company,
          bio1: bio1,
          bio2: bio2,
          bio3: bio3,
          profileImage: profileImage?.location,
          logoImage: logoImage?.location,
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
        throwError(
          404,
          'ไม่มีข้อมูล Info',
          {
            profileId: profileId,
          },
          false
        );
      }

      return res.status(200).json({
        cardName: info.Profile.name,
        coverImage: info.Profile.coverImage,
        colorCoverImage: info.Profile.colorCoverImage,
        name: info.name,
        job: info.job,
        company: info.company,
        bio1: info.bio1,
        bio2: info.bio2,
        bio3: info.bio3,
        profileImage: info.profileImage,
        logoImage: info.logoImage,
      });
    })
    .catch((error) => {
      next(error);
    });
};

const updateInformation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError(400, errors.array()[0].msg, errors.array(), true);
    }
  } catch (error) {
    return next(error);
  }

  const profileId = req.headers.profile;

  const cardName = req.body.cardName;
  const name = req.body.name;
  const job = req.body.job;
  const company = req.body.company;
  const bio1 = req.body.bio1;
  const bio2 = req.body.bio2;
  const bio3 = req.body.bio3;
  const coverImage = req.body.coverImage;
  const colorCoverImage = req.body.colorCoverImage;

  const profileImage = req.files?.['profileImage']?.[0];
  const logoImage = req.files?.['logoImage']?.[0];

  const transaction = await db.sequelize.transaction();
  transaction.afterCommit(() => {
    return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
  });

  try {
    await db.Profile.update(
      {
        name: cardName,
        coverImage: coverImage,
        colorCoverImage: colorCoverImage,
      },
      {
        where: { id: profileId },
        transaction: transaction,
      }
    );
    await db.Info.update(
      {
        name: name,
        job: job,
        company: company,
        bio1: bio1,
        bio2: bio2,
        bio3: bio3,
        profileImage: profileImage?.location,
        logoImage: logoImage?.location,
      },
      {
        where: { profileId: profileId },
        include: { model: db.Profile },
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
