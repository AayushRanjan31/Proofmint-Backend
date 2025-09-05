const {getAllTheUsers, deleteAUser} = require('../services/adminService');

const getAllUser = async (req, res, next)=> {
  try {
    const users = await getAllTheUsers();
    res.status(200).json({
      status: true,
      users: users,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next)=> {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        status: false,
        message: 'id is required',
      });
    }
    await deleteAUser(id);

    res.status(200).json({
      status: true,
      message: 'User has deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {getAllUser, deleteUser};
