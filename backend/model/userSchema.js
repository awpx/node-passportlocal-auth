const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
}, { timestamps: true }
);

module.exports = mongoose.model('userPassport', userSchema);