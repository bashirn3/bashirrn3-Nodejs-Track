const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {type: String, required: true, enum: ['primary','jss','sss'] },
  subjects: [ { type: mongoose.Schema.Types.ObjectId,ref:'Subject'} ]
});

module.exports = mongoose.model('Category', categorySchema);