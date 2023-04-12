const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { secret } = require("../helpers/api");
const UserModel = require("../models/User");

const middleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const data = jwt.verify(token, secret);
    const user = await UserModel.findOne({ _id: data._id, token: token });
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.redirect("/login");
  }
};
module.exports = middleware;
