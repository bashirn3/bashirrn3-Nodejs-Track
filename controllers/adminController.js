const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Subject = require('../models/subjectModel');
const Lesson = require('../models/lessonModel');

//create a subject
exports.createSubject = (req, res, next) =>{
  const { subjectName, categoryName } = req.body;
  Subject.findOne({ name: subjectName })
  .then( result =>{
    if(result){
      return res
      .status(404).send({ status: false, message: "subject already exists "})
    } else{
      let newSubject = new Subject({
        name: subjectName,
        category:  categoryName
      })
        newSubject.save();

        Category.findOneAndUpdate( {name: categoryName}, { $push: {subjects: newSubject._id }},
          { new: true, useFindAndModify: false } 
          ).then( result =>{
          return result.save();
        })
        return newSubject
      }
    }).then(newSubject =>{
      res
      .status(200).json({ status: true, message: "subject has created successfully", newSubject })
    }).catch(err => console.log(err))
 
}

// controller for creating a category
exports.createCategory = (req, res, next)=>{
  const { name } = req.body

  if( name != 'jss' && name != 'sss' && name != 'primary' ){
    return res
    .status(404).send({ message: "Name of category must be either primary, secondary or jss"})
  }

  Category.findOne({ name })
  .then( result =>{
    if(result){
      return res
      .status(404).send({ status: false, message: "category already exists "})
    } else{
      const newCategory = new Category({
        name: name
      })
        newCategory.save();
        return newCategory
      }
    }).then( newCategory =>{
      res
      .status(200).send({ message: "category has been created successfully", newCategory })
    }).catch(err => console.log(err))

}  
//admin can update a subject in a category by ID

exports.updateSubjectById = (req, res, next ) =>{

  const{ subjectId, subjectName } = req.body


    Subject.findById(subjectId)
    .then( result =>{
      if(!result){
        return res
        .status(404).send({ status: false, message: "Subject not found"});
      } else{
        Subject.findByIdAndUpdate(subjectId, {name: subjectName }).then( result =>{
          Subject.findById(subjectId)
          .then( subject =>{
            return res.status(200).send({ status: true, message: "subject has been updated successfully",
          data: subject,})
          })
        })
      }
    }).catch(err => console.log(err))
}

//admin can delete a subject in a category byId

exports.deleteSubjectById = (req, res, next ) =>{
  
  const { subjectId, categoryName } = req.body
 
  Subject.findById(subjectId)
  .then( result => {
    if(!result){
      return res
      .status(404).send({ status: false, message: "subject not found"})
    } else{
      Subject.findByIdAndDelete(subjectId)
      .then(result =>{
    
        Category.update( categoryName, {$pull: { subjects: { $gte: subjectId }}})
        return res
        .status(200).json({ data: result,
        message: "subject has been deleted successfully" })
      })
    }
  }).catch(err => console.log(err))

}

//admin can delete a category

exports.deleteCategory = (req, res, next ) =>{
  const { categoryId } = req.body

  Category.findById(categoryId)
  .then( result =>{
    if(!result){
      return res
      .status(404).send({status: false, message: "category not found "})
    } else {
      Category.findByIdAndDelete(categoryId)
      .then( result =>{
        res.status(200).send({
          data: result,
          message: "category deleted successfully"
        })
      })
    }
  }).catch(err => console.log(err))

}

exports.getAllTutors = (req, res, next ) =>{
  // console.log(req.user.role);
  User.find({ role: 'tutor'})
  .then( result =>{
    return res
    .status(200).send({status: true, data: result })
  }).catch(err => console.log(err))
}

//admin can get tutor by id

exports.getTutorById = (req, res, next) =>{
  const {tutorId } = req.body

  User.findById(tutorId)
  .then( result =>{
    if(!result){
      return res
      .status(404).send({status: false, message: "invalid tutor Id"})
    }else if(result.role !== 'tutor'){
      return res
      .status(404).send({status: false, message: "Not a valid tutor Id"})
    }else{
      return res
      .status(200).json({status: true, data: result,})
    }
  }).catch(err => console.log(err))
}


//admin can deactivate a tutor by Id

exports.deleteTutorById = (req, res, next ) =>{
 const {tutorId } = req.body

 User.findById(tutorId)
 .then(result => {
   if(!result){
     return res
     .status(404).send({status: false, message: "invalid tutor Id"})
   }else{
     User.findByIdAndDelete(tutorId)
     .then( result => {
       return res
       .status(200).send({status: true, message: "tutor deactivated successfully"})
     })
   }
 }).catch(err => console.log(err))

}

//admin can book lessons

exports.bookLesson = async (req, res, next ) =>{
  try{

    const { subjectName, categoryId, tutorName, studentName } = req.body

    const checkSubject = await Subject.findOne({name: subjectName})
    if(!checkSubject){
      return res
      .status(404).send({status: false, message: "Subject not found"})
    }
    const checkTutor = await User.findOne({firstname: tutorName} );
    if(!checkTutor){
      return res 
      .status(404).send({status: false, message: "tutor not found"})
    }
    const checkStudent = await User.findOne({firstname: studentName})
    if(!checkStudent){
      return res 
      .status(404).send({status: false, message: "Student not found"})
    }
    const category = await Category.findById(categoryId)
    if(!category){
      return res 
      .status(404).json({status: false, message: "Invalid category Id"})
    }
    const checkLesson = await Lesson.findOne({
      studentName : studentName,
      subjectName: subjectName,
      tutorName: tutorName,
      category: categoryId,
    })
    if(checkLesson){
      return res
      .status(403).send({status: false, message: "lesson with exact details already exists ",})
    } else{
      const newLesson = await new Lesson({
        studentName: studentName,
        tutorName: tutorName,
        subjectName: subjectName,
        category: categoryId,
      })
      await newLesson.save();
  
      const pushTutorLesson = await User.findOneAndUpdate( {firstname: tutorName}, { $push: { lessons: newLesson._id }},
        { new: true, useFindAndModify: false } 
        );
        await pushTutorLesson.save();
  
      const pushStudentLesson = await User.findOneAndUpdate( {firstname: studentName}, { $push: { lessons: newLesson._id }},
        { new: true, useFindAndModify: false } 
        );
        await pushStudentLesson.save();
        
      res.json({
        status: true,
        message: "lesson booked successfully",
        data: newLesson
      })
    }
    
  } catch(error) {
    next(error)
  }
}

//admin can retrive all lessons

exports.getAllLessons = (req, res, next) =>{

  Lesson.find({})
  .then( result =>{
    return res
    .status(200).send({status: true, data: result })
  }).catch(err => console.log(err))
}

//admin can get a lesson by Id

exports.getLessonById = (req, res, next ) =>{
  const{ lessonId } = req.body

  Lesson.findById(lessonId)
  .then(result =>{
    if(!result){
      return res
      .status(404).send({status: false, message: "invalid lesson Id"})
    }else{
      return res
      .status(200).json({status: true, data: result,})
    }
  }).catch( err => console.log(err))
}

//admin can update a lesson by id

exports.updateLessonById = async (req, res, next ) =>{
  try { 
    const { lessonId, subjectName, categoryId, tutorName, studentName } = req.body

    const lesson = await Lesson.findById(lessonId)
    if(!lesson){
      return res
      .status(404).send({status: false, message: "lesson does not exist"})
    }

    const update = await Lesson.findByIdAndUpdate(lessonId, {
      studentName: studentName,
      tutorName: tutorName,
      subjectName: subjectName,
      category: categoryId,
    })
    await update.save();

    const result = await Lesson.findById(lessonId);
    res.status(200).json({
      status: true,
      message: "Lesson has been updated",
      data: result,
    })
  }catch(err){console.log(err)}
}

//admin can delete a lesson by id

exports.deleteLessonById = (req, res, next) =>{
  const { lessonId } = req.body

  Lesson.findById(lessonId)
  .then(result =>{
    if(!result){
      return res
      .status(404).json({
        status: false,
        message: "lesson not found"
      })
    }else {
      Lesson.findByIdAndDelete(lessonId)
      .then(result =>{
        return res
        .status(200).json({
          data: null,
          message: "Lesson has been deleted"
        })
      })
    }
  }).catch(err => console.log(err));
}

//make tutor an admin 

exports.makeTutorAdmin = (req, res, next) =>{
  
  const { tutorId, } = req.body

  User.findById(tutorId)
  .then(result =>{
    if(!result || result.role != 'tutor'){
      return res 
      .status(404).json({ status: false, message: "Invalid Id or Id doesn't belong to a tutor"})
    }else{
      User.findByIdAndUpdate(tutorId, {role: 'admin' })
      .then( tutor =>{
        tutor.save()
        return res
        .status(200).json({ status: true, message: "Upgraded tutor to admin role!"});
      })
    }
  }).catch(error => console.log(error));

}