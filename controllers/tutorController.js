const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const Category = require('../models/categoryModel');
const Lesson = require('../models/lessonModel');

//tutor can register to take a subject

exports.registerSubject = async (req, res, next ) =>{
try{
  const { subjectName, tutorId } = req.body

  const subject = await Subject.findOne(subjectName);
  if (!subject){
    return res
    .status(404).json({status: false, message: "Subject not found "})
  }

  const tutor = await User.findById(tutorId);
  if(!tutor){
    return res
    .status(404).json({status: false, message: "tutor not found "})
  }
  
  await Subject.findOneAndUpdate( subjectName, { $push: { tutors : tutorId }},
    { new: true, useFindAndModify: false } 
    );
  await User.findByIdAndUpdate(tutorId,{$push: {subjects: subjectName }},
    {new: true, useFindAndModify:false }
     )
     const newSubject = await Subject.findOne(subjectName);
     res.json({
       status: true,
       message: "subjects registered successfully",
       data: newSubject,
     })
  
}catch(err) {console.log(err)};

}
