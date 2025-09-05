const User = require('../models/user');
const getAllTheUsers = async ()=> {
  const users = await User.findAll();
  const userData = users.map((ele)=> {
    const user = {
      id: ele.id,
      firstName: ele.firstName,
      lastName: ele.lastName,
      number: ele.number,
      email: ele.email,
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

module.exports = {getAllTheUsers, deleteAUser, getAUser};

