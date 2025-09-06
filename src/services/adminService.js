const User = require('../models/user');
const Document = require('../models/document');
const getAllTheUsers = async ()=> {
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
};

const deleteAUser = async (userId)=> {
  const user = await User.findOne({where: {id: userId}});
  if (!user) throw new Error('User not found');
  // Delete user
  await User.destroy({where: {id: userId}});
  return true;
};

const getAUser = async (id)=> {
  const user = await User.findOne({where: {id}});
  return user;
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
    throw new Error(err.message);
  }
};

const documentDelete = async (certificateId)=> {
  try {
    const document = await Document.findOne({where: {id: certificateId}});
    if (!document) throw new Error('There is no Document related to this certificateId');

    const deleteDocs = await Document.destroy({where: {id: certificateId}});
    return deleteDocs;
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = {getAllTheUsers, deleteAUser, getAUser, allDocument, documentDelete};

