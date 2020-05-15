const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminController');
const auth = require('../controllers/auth');

//create a subject
router.post('/api/v1/subject',auth.grantAdminAccess, adminControllers.createSubject );

// create a category 
router.post('/api/v1/category',auth.grantAdminAccess, adminControllers.createCategory );

//update subject by id
router.patch('/api/v1/subject',auth.grantAdminAccess, adminControllers.updateSubjectById);

//delete subject by id
router.delete('/api/v1/subject',auth.grantAdminAccess, adminControllers.deleteSubjectById)


//delete category
router.delete('/api/v1/category',auth.grantAdminAccess, adminControllers.deleteCategory);


//admin can get all tutors
router.get('/api/v1/tutors',auth.grantAdminAccess, adminControllers.getAllTutors);

//get tutor by ID
router.get('/api/v1/tutor',auth.grantAdminAccess, adminControllers.getTutorById);

//delete tutor by Id
router.delete('/api/v1/tutor',auth.grantAdminAccess, adminControllers.deleteTutorById);

//admin can book lessons
router.post('/api/v1/lesson',auth.grantAdminAccess, adminControllers.bookLesson);

//retrieve all lessons
router.get('/api/v1/lessons',auth.grantAdminAccess, adminControllers.getAllLessons);

//get lesson by id
router.get('/api/v1/lesson',auth.grantAdminAccess, adminControllers.getLessonById);


//update a lesson by id
router.patch('/api/v1/lesson',auth.grantAdminAccess, adminControllers.updateLessonById);

//admin can delete a lesson by id
router.delete('/api/v1/lesson',auth.grantAdminAccess, adminControllers.deleteLessonById);

//admin can make tutor an admin
router.patch('/api/v1/user',auth.grantAdminAccess,adminControllers.makeTutorAdmin);

module.exports = router;