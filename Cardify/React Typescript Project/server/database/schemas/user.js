const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  cards: {
    type: Array,
    default: [],
  },
  businessAccount: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("users", UserSchema);
