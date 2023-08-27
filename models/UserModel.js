const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  // Other user details
});

const User = mongoose.model("User", userSchema);
module.exports = User;
// exports.validate = validateUser;
// module.exports = {
//   User: User,
//   validateUser: validateUser,
// };
