const {getAllTheUsers, deleteAUser, allDocument, documentDelete} = require('../services/adminService');

const getAllUser = async (req, res, next)=> {
  try {
    const users = await getAllTheUsers();
    res.status(200).json({
      status: true,
      users: users,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const deleteUser = async (req, res, next)=> {
  try {
    const id = req.params.id;
    if (!id) {
      const error = new Error('id is required');
      error.statusCode = 400;
      throw error;
    }
    await deleteAUser(id);

    res.status(200).json({
      status: true,
      message: 'User has deleted successfully',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
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
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const {certificateId} = req.body;
    if (!certificateId) {
      const error = new Error('certificateId is required');
      error.statusCode = 400;
      throw error;
    }
    const deleteDoc = await documentDelete(certificateId);
    if (!deleteDoc) {
      const error = new Error('Document not found or already deleted');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: 'Document deleted Successfully',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = {getAllUser, deleteUser, getAllDocument, deleteDocument};
