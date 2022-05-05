const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
//database schema for user profile
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  questions: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Question' }]
});
//validator plugin verify entered data
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
