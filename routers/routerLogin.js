const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const { secret } = require("../helpers/api");
const UserModal = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/submit_form", upload.none(), async (req, res) => {
  const { email, password } = req.body;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập email.",
    });
  } else if (!regex.test(email)) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập email đúng định dạng.",
    });
  } else if (!password) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập mật khẩu.",
    });
  } else if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập mật khẩu nhiều hơn 6 kí tự.",
    });
  } else {
    try {
      const userLogin = await UserModal.findOne({ email });

      if (!userLogin) {
        res.status(400).json({
          success: false,
          message: "Tài khoản không tồn tại.Hãy đăng kí nếu chưa có tài khoản.",
        });
      } else {
        const checkPass = await bcrypt.compare(password, userLogin.password);
        if (!checkPass) {
          res.status(400).json({
            success: false,
            message: "Mật khẩu sai, hãy kiểm tra lại.",
          });
        } else {
          res.cookie("token", userLogin.token, {
            maxAge: 7200000,
            httpOnly: true,
          });
          if (userLogin.userAuthorization) {
            res.json({ success: true, redirectUrl: "/home" });
          } else {
            res.json({ success: true, redirectUrl: "/homeUser" });
          }
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra.",
      });
    }
  }
});

module.exports = router;
