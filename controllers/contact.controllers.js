const { throwError } = require('../helpers/throwError');
const db = require('../models/index');

const getContactList = (req, res, next) => {
  db.ContactItem.findAll()
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((error) => {
      next(error);
    });
};

const getMyContact = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.params.profileId;

  db.Contact.findAll({
    where: { profileId: profileId },
    include: [
      {
        model: db.Profile,
        attributes: ['accountId'],
        where: { accountId: accountId },
      },
      { model: db.ContactItem },
    ],
  })
    .then((contacts) => {
      return res.status(200).json(contacts);
    })
    .catch((error) => {
      next(error);
    });
};

const addContact = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profileId;
  const contactItemId = req.body.contactItemId;
  const urlUnique = req.body.urlUnique;

  db.Profile.findOne({ where: { id: profileId, accountId: accountId } })
    .then(async (profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      const createContact = await db.Contact.create({
        contactItemId: contactItemId,
        profileId: profileId,
        urlUnique: urlUnique,
      });
      return createContact.save();
    })
    .then((dataCreate) => {
      res.status(200).json(dataCreate);
    })
    .catch((error) => {
      next(error);
    });
};

const updateContact = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profileId;
  const contactId = req.body.contactId;
  const urlUnique = req.body.urlUnique;

  db.Profile.findOne({ where: { id: profileId, accountId: accountId } })
    .then(async (profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      db.Contact.update(
        {
          urlUnique: urlUnique,
        },
        {
          where: {
            id: contactId,
            profileId: profileId,
          },
        }
      )
        .then((isUpdate) => {
          if (!isUpdate[0]) {
            throwError(400, 'อัพเดทไม่สำเร็จ', {
              contactId: contactId,
            });
          }
          return res.status(200).json('อัพเดท Contact สำเร็จ');
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteContact = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profileId;
  const contactId = req.body.contactId;

  db.Profile.findOne({ where: { id: profileId, accountId: accountId } })
    .then(async (profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      db.Contact.destroy({
        where: { id: contactId, profileId: profileId },
        include: { model: db.Info },
      })
        .then((isDestroy) => {
          if (isDestroy) {
            return res.status(200).json({ message: 'ลบสำเร็จ' });
          }
          throwError(404, 'ไม่พบข้อมูล', {
            contactId: contactId,
            profileId: profileId,
          });
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
};

const toggleEnable = (req, res, next) => {
  const accountId = req.account.id;
  const profileId = req.headers.profileId;
  const contactId = req.body.contactId;

  db.Profile.findOne({ where: { id: profileId, accountId: accountId } })
    .then(async (profile) => {
      if (!profile) {
        throwError(404, 'ไม่พบข้อมูล', {
          accountId: accountId,
          profileId: profileId,
        });
      }
      db.Contact.findOne({ where: { id: contactId, profileId: profileId } })
        .then((contact) => {
          if (!contact) {
            throwError(404, 'ไม่พบข้อมูล', {
              contactId: contactId,
              profileId: profileId,
            });
          }
          const status = contact.status === 'enable' ? 'disable' : 'enable';
          return db.Contact.update(
            { status: status },
            {
              where: { id: contactId, profileId: profileId },
              returning: true,
            }
          );
        })
        .then((dataUpdate) => {
          return res.status(200).json(dataUpdate[1][0]);
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
};

const updateSort = (req, res, next) => {
  return res.status(200).json('Update Sort');
};

module.exports = {
  getContactList,
  getMyContact,
  addContact,
  updateContact,
  deleteContact,
  toggleEnable,
  updateSort,
};
