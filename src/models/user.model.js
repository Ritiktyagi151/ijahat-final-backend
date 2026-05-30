const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    default: ""
  },

  firstName: {
    type: String,
    default: ""
  },

  lastName: {
    type: String,
    default: ""
  },

  loginName: {
    type: String,
    default: ""
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  qualification: {
    type: String,
    default: ""
  },

  interest: {
    type: String,
    default: ""
  },

  address: {
    type: String,
    default: ""
  },

  city: {
    type: String,
    default: ""
  },

  state: {
    type: String,
    default: ""
  },

  country: {
    type: String,
    default: ""
  },

  pinCode: {
    type: String,
    default: ""
  },

  mobile: {
    type: String,
    default: ""
  },

  avatar: {
    type: String,
    default: ""
  },

  forgotPasswordOTP: {
    type: String
  },

  forgotPasswordOTPExpiry: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
