const { arraySortContact } = require('../functions/arraySortContact');
const db = require('../models/index');

exports.getArrayContact = async (profileId) => {
  const contacts = db.Contact.findAll({
    where: { profileId: profileId },
  })
    .then((contacts) => {
      const sortContacts = arraySortContact(contacts);
      return sortContacts;
    })
    .catch((error) => {
      throw error;
    });
  return contacts;
};
