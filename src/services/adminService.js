const User = require('../models/user');
const Document = require('../models/document');

const getAllTheUsers = async ()=> {
  try {
    const users = await User.findAll();
    const userData = users.map((ele)=> {
      const user = {
        id: ele.id,
        firstName: ele.firstName,
        lastName: ele.lastName,
        number: ele.number,
        email: ele.email,
        role: ele.role,
      };
      return user;
    });

    return userData;
  } catch (err) {
    const error = new Error('Failed to fetch users');
    error.statusCode = 500;
    throw error;
  }
};

const deleteAUser = async (userId)=> {
  try {
    const user = await User.findOne({where: {id: userId}});
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    await User.destroy({where: {id: userId}});
    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const getAUser = async (id)=> {
  try {
    const user = await User.findOne({where: {id}});
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const allDocument = async ()=> {
  try {
    const allDocs = await Document.findAll();
    const documents = allDocs.map((ele)=> {
      const obj = {
        certificateId: ele.id,
        status: ele.status,
        title: ele.title,
        issuer: ele.issuer,
        expiry: ele.expiry,
        documentId: ele.documentId,
        updatedAt: ele.updatedAt,
      };
      return obj;
    });
    return documents;
  } catch (err) {
    const error = new Error('Failed to fetch documents');
    error.statusCode = 500;
    throw error;
  }
};

const documentDelete = async (certificateId)=> {
  try {
    const document = await Document.findOne({where: {id: certificateId}});
    if (!document) {
      const error = new Error('There is no Document related to this certificateId');
      error.statusCode = 404;
      throw error;
    }
    const deleteDocs = await Document.destroy({where: {id: certificateId}});
    return deleteDocs;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

module.exports = {getAllTheUsers, deleteAUser, getAUser, allDocument, documentDelete};
