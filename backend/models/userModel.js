const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name can't be empty"],
  },
  username: {
    type: String,
    required: [true, "Username can't be empty"],
  },
  nik: {
    type: Number,
    required: [true, "NIK can't be empty"],
  },
  email: {
    type: String,
    required: [true, "Email can't be empty"],
  },
  password: {
    type: String,
    required: [true, "Password can't be empty"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
