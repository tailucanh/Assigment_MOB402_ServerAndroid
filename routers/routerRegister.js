const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer();

app.use(bodyParser.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register_form", upload.none(), async (req, res) => {
  const { email, password, name, re_password } = req.body;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập tên.",
    });
  } else if (!email) {
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
  } else if (!re_password) {
    res.status(400).json({
      success: false,
      message: "Vui lòng nhập lại mật khẩu.",
    });
  } else if (re_password !== password) {
    res.status(400).json({
      success: false,
      message: "Mât khẩu không trùng khớp. Hãy kiểm tra lại.",
    });
  } else {
    const checkUser = await UserModel.findOne({ email });

    if (checkUser) {
      res.status(400).json({
        success: false,
        message: "Email đã được đăng kí. Hãy chọn email khác.",
      });
    } else {
      const salt = await bcrypt.genSalt(15);
      const bcryptPassWord = await bcrypt.hash(password, salt);

      const user = new UserModel({
        name: name,
        avatar: { data: "", contentType: "" },
        email: email,
        password: bcryptPassWord,
        userAuthorization: false,
      });
      const token = await user.generateAuthToken();
      try {
        await user.save();
        res.json({ success: true, redirectUrl: "/login" });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Đã có lỗi xảy ra.",
        });
      }
    }
  }
});

module.exports = router;
