const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  firstName: { type: String, default: '' },  
  lastName: { type: String, default: '' },   
  address: { type: String, default: '' },
  profilePic: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
