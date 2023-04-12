const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secret } = require("../helpers/api");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

  userAuthorization: {
    type: Boolean,
  },
  token: {
    type: String,
    required: false,
  },
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    {
      _id: user._id,
    },
    secret
  );
  user.token = token;
  await user.save();
  return token;
};

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;
