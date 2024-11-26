const mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
  //   required: true,
  //   ref: 'User',
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Password || mongoose.model("Password", PasswordSchema);
