exports.arraySortContact = (arrayContacts) => {
  const sortArray = [];
  const firstContact = arrayContacts.find((contact) => {
    return contact.dataValues.afterContactId === null;
  });

  if (firstContact) {
    sortArray.push(firstContact);
  }

  for (let i = 1; i < arrayContacts.length; i++) {
    const contactAfterLastIndex = arrayContacts.find((contact) => {
      return (
        contact.dataValues.afterContactId ===
        sortArray[sortArray.length - 1].dataValues.id
      );
    });
    if (contactAfterLastIndex) {
      sortArray.push(contactAfterLastIndex);
    }
  }

  return sortArray;
};
