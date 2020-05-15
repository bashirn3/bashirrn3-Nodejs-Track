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

exports.logIn = (req, res, next) =>{
  const { email, password } = req.body;
  User.findOne({ email })
  .then(user =>{
    if(!user){
      return res
      .status(404)
      .send({ status: false,message: "Incorrect email address, please check and try again "})
    }
    bcrypt.compare(password, user.password)
    .then(valid =>{
      if(!valid){
        return res
        .status(404)
        .send({ status: false, message: "Password incorrect, please try again "})
      }
      const accessToken = jwt.sign(
        {email: user.email, _id: user._id }, "sometoken", { expiresIn: "1hr" }
      );
      User.findByIdAndUpdate(user._id, {accessToken: accessToken})
      res.status(200).send({
        status: true,
        message: "Login successful",
        _id: user._id,
        accessToken
      })
      console.log(user.accessToken)
    })
  })
  .catch(err => console.log(err))
}

exports.grantAdminAccess = async (req, res, next) => {
  try{
    const token  = req.body.token
    if (!token || token == undefined) {
      return res
      .status(404).send({status: false, message: "A valid token is required to access this route"})
    }
    let user = await User.findOne({accessToken: token})
    const role = user.role
    if(role !== 'admin'){
      return res
      .status(401).send({
        data: false,
        message: "You do not have access to this route"
      })
    }
    next();
  } catch(error){
    next(error)
  }

}

exports.grantTutorAccess = async (req, res, next) => {
  try{
    const token  = req.body.token
    if (!token || token == undefined) {
      return res
      .status(404).send({status: false, message: "A valid token is required to access this route"})
    }
    const user = await User.findOne({accessToken: token})
    const role = user.role
    if(role !== 'tutor'){
      return res
      .status(401).send({
        data: false,
        message: "You do not have access to this route"
      })
    }
    next();
  } catch(error){
    next(error)
  }

}

exports.grantUserAccess = async (req, res, next) => {
  try{
    const token  = req.body.token
    if (!token || token == undefined) {
      return res
      .status(404).send({status: false, message: "A valid token is required to access this route"})
    }
    const user = await User.findOne({accessToken: token})
    const role = user.role
    if(!role){
      return res
      .status(401).send({
        data: false,
        message: "You do not have access to this route"
      })
    }
    next();
  } catch(error){
    next(error)
  }

}