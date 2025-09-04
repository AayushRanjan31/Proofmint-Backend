const inValidUser = (res)=> {
  res.status(401).json({
    status: false,
    message: 'Invalid credentials',
  });
};

const missingCredentials = (res)=> {
  res.status(400).json({
    status: false,
    message: 'All fields are require',
  });
};

const passwordSort = (res)=> {
  res.status(400).json({
    status: false,
    message: 'minimum password length should be 8 ',
  });
};

module.exports = {inValidUser, missingCredentials, passwordSort};

