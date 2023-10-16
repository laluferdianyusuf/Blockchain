const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, "Name can't be empty"],
  },
  username: {
    type: String,
    required: [true, "Username can't be empty"],
  },
  email: {
    type: String,
    required: [true, "Email can't be empty"],
  },
  password: {
    type: String,
    required: [true, "Password can't be empty"],
  },
  phone_number: {
    type: String,
    required: [true, "Phone number can't be empty"],
  },
  otp_enable: {
    type: Boolean,
  },
  otp_code: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
