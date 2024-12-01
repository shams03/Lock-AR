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
  userId: { // New attribute
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Delete the existing model if it exists
if (mongoose.models.Password) {
  delete mongoose.models.Password;
}
// Use `mongoose.model` to fetch the existing model or create a new one
const Password =mongoose.model("Password", PasswordSchema);

module.exports = Password;
