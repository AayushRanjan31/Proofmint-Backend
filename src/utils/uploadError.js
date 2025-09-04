const uploadError = (res)=> {
  res.status(40).json({
    status: false,
    message: 'All fields are require [title, expire date, username]',
  });
};
module.exports = uploadError;
