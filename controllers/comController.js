const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const Category = require('../models/categoryModel');




//admin, students and tutors can retrieve all subjects by category
exports.getAllSubjectInCategory = (req, res, next ) =>{
  const { categoryName } = req.body;

  Category.findOne({ name: categoryName })
  .populate('subjects')
  .then( result =>{
    res.status(200).send({ message: result})
  }).catch( err => console.log )
}


//admin, students and tutors can retrieve a subject in a category by ID
exports.getSubjectById = (req, res, next ) =>{
  const { subjectId, categoryName } = req.body;
  
  Category.findOne({ name: categoryName })
  .populate({path: 'subjects', match: { _id: subjectId }})
  .then( result =>{
    if(!result){
      return res.status(404).json({status: false, message: "resourse not found"})
    }else{
      return res
    .status(200).json({ status: true, message: result.subjects })
    }
    
  }).catch( err => console.log )
}

//get all categories
exports.getAllCategories = (req, res, next ) => {
  
  Category.find({})
  .then( result => {
    res.status(200).send({
      status: true,
      message: result,
    })
  }).catch( err => console.log )
}


//search for subjects by name sorted alphabetically in ascending order

exports.searchSortedSubjects = (req, res, next ) =>{
  // const { name, sort } = req.body

  Subject.find().sort({ name : 1 })
  .then( result =>{
    res.status(200).send({
      status: true,
      message: result
    })
  })
}

//can search for tutors by firstname, sorted alphabetically in ascending order

exports.searchSortedSubjects = (req, res, next ) =>{
  // const { name, sort } = req.body

  User.find({role: 'tutor'}).sort({ firstname : 1 })
  .then( result =>{
    res.status(200).send({
      status: true,
      message: result
    })
  })
}