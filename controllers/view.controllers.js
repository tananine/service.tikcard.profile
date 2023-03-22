const { getView } = require('../functions/getView');

const getViewProfile = async (req, res, next) => {
  const profileId = req.params.profileId;

  try {
    const view = await getView(profileId);
    return res.status(200).json(view);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getViewProfile,
};
