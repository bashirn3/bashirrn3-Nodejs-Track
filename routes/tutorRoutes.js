const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const auth = require('../controllers/auth');

//tutor can register to take a subject in a category
router.post('/api/v1/register', tutorController.registerSubject);

module.exports = router;