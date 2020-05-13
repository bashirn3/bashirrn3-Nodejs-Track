const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  studentName: {type: String, required: true},
  tutorName: {type: String, required: true},
  subjectName: {type: String},
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Lesson', lessonSchema);