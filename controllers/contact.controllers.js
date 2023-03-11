const { throwError } = require('../functions/throwError');
const { arraySortContact } = require('../functions/arraySortContact');
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

  try {
    const createContact = await db.Contact.create({
      contactItemId: contactItemId,
      profileId: profileId,
      urlUnique: urlUnique,
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

const deleteContact = (req, res, next) => {
  const profileId = req.headers.profile;
  const contactId = req.params.contactId;

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
