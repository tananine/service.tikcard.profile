const { throwError } = require('../functions/throwError');
const { arraySortContact } = require('../functions/arraySortContact');
const { getArrayContact } = require('../functions/getArrayContact');
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
  const profileId = req.headers.profile;

  db.Contact.findAll({
    where: { profileId: profileId },
    include: [{ model: db.ContactItem }],
  })
    .then((contacts) => {
      const sortContacts = arraySortContact(contacts);
      return res.status(200).json(sortContacts);
    })
    .catch((error) => {
      next(error);
    });
};

const addContact = async (req, res, next) => {
  const profileId = req.headers.profile;
  const contactItemId = req.body.contactItemId;
  const urlUnique = req.body.urlUnique;

  const contacts = await getArrayContact(profileId);
  const lastIndexContacts =
    contacts[contacts.length - 1]?.dataValues.id || null;

  try {
    const createContact = await db.Contact.create({
      contactItemId: contactItemId,
      profileId: profileId,
      urlUnique: urlUnique,
      afterContactId: lastIndexContacts,
    });
    await createContact.save();
    return res.status(200).json('เพิ่มสำเร็จ');
  } catch (error) {
    next(error);
  }
};

const updateContact = (req, res, next) => {
  const profileId = req.headers.profile;
  const contactId = req.body.contactId;
  const urlUnique = req.body.urlUnique;

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
};

const deleteContact = async (req, res, next) => {
  const profileId = req.headers.profile;
  const contactId = req.params.contactId;

  const transaction = await db.sequelize.transaction();
  transaction.afterCommit(() => {
    return res.status(200).json({ message: 'ลบสำเร็จ' });
  });

  const contacts = await getArrayContact(profileId);
  const targetIndex = contacts.findIndex(
    (contact) => contact.dataValues.id === parseInt(contactId)
  );

  try {
    if (contacts[targetIndex + 1]) {
      await db.Contact.update(
        {
          afterContactId: contacts[targetIndex].dataValues.afterContactId,
        },
        {
          where: {
            id: contacts[targetIndex + 1].dataValues.id,
            profileId: profileId,
          },
          transaction: transaction,
        }
      );
    }
    await db.Contact.destroy({
      where: { id: contactId, profileId: profileId },
      transaction: transaction,
    }).then((isDestroy) => {
      if (!isDestroy) {
        throwError(404, 'ไม่พบข้อมูล', {
          contactId: contactId,
          profileId: profileId,
        });
      }
    });
    transaction.commit();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const toggleEnable = (req, res, next) => {
  const profileId = req.headers.profile;
  const contactId = req.body.contactId;

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
