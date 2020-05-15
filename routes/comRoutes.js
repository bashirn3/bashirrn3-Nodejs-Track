const express = require('express');
const router = express.Router();
const comControllers = require('../controllers/comController.js');
const auth = require('../controllers/auth');



//get a subject by ID
router.get('/api/v1/category/subject',auth.grantUserAccess, comControllers.getSubjectById);

//General route
//find all subjects in a category
router.get('/api/v1/category/subjects',auth.grantUserAccess, comControllers.getAllSubjectInCategory);

//admin, students and tutors can retrieve a subject in a category by ID


//get all categories
router.get('/api/v1/categories',auth.grantUserAccess, comControllers.getAllCategories);


//search for subjects sorted
router.get('/api/v1/subjects/search',auth.grantUserAccess, comControllers.searchSortedSubjects);

//search for tutors and sort
router.get('/api/v1/tutors/search',auth.grantUserAccess, comControllers.searchSortedSubjects);

module.exports = router;