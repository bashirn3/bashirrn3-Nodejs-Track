const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) =>{
  const { firstname, lastname, email, password, role } = req.body

  if(!firstname || !lastname || !email || !password){
    res.status(400)
    res.send({ status: false, message: "All fields are required"})
    return;
  } else if(role == 'admin'){
    res.status(400).send({ status: false, message: "You can not sign up as an admin"})
    return;
  }

  User.findOne({ email })
  .then(user => {
    if (user) {
      return res
        .status(423)
        .send({status: false, message: "This email already exists"});
    }else{
      bcrypt
  .hash(password, 12)
  .then(password => {
    let user = new User({
      firstname,
      lastname,
      email,
      password,
      role: role || 'student',
    });
    const accessToken = jwt.sign({userId: user._id }, 'sometoken', { expiresIn: '3d' });
    user.accessToken = accessToken;
     user.save();
     return user;
  })
  .then((user) => res.status(200).send({ status: true, message: "User registered successfully", user: user }))
    }
  })
  .catch(err => console.log(err));
}
