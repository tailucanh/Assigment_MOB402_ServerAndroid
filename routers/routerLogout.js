const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const middleware = require("../helpers/middleware");

router.use(cookieParser());

router.get("/", middleware, (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
