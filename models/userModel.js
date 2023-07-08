// eslint-disable-next-line import/no-extraneous-dependencies
const validation = require('validator');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
    minLength: [3, 'Name must not be less than 4 characters']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    trim: true,
    lowerCase: true,
    validate: [validation.isEmail, 'Please input a proper email!']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: [8, 'Password must be greater than 8 characters!!']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your passwords']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
