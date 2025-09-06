const {getAllTheUsers, deleteAUser, allDocument, documentDelete} = require('../services/adminService');

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

const getAllDocument = async (req, res, next)=> {
  try {
    const allDocs = await allDocument();
    res.status(200).json({
      status: true,
      allDocs,
    });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const {certificateId} = req.body;
    const deleteDoc = await documentDelete(certificateId);
    if (!deleteDoc) return next();
    res.status(200).json({
      status: true,
      message: 'Document deleted Successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {getAllUser, deleteUser, getAllDocument, deleteDocument};
