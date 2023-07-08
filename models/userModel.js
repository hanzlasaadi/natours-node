// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const validation = require('validator');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

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
    minLength: [8, 'Password must be greater than 8 characters!!'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm your passwords'],
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password must match! Try Again!!!'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
