const express = require("express");
const router = express.Router();
const middleware = require("../helpers/middleware");
const UserModal = require("../models/User");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
var upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/:id", upload.single("avatar"), middleware, async (req, res) => {
  const userId = req.params.id;
  const { name, email, valueOldPassword, valueNewPassword } = req.body;

  const user = await UserModal.findOne({ _id: userId });
  const checkUser = await UserModal.findOne({ email });

  const checkOldPass = await bcrypt.compare(valueOldPassword, user.password);

  if (checkUser && user.email != checkUser.email) {
    console.log("Email này đã tồn tại. Bạn không thể thay đổi email.");

    res.redirect(
      "/home?alertErr=" +
        encodeURIComponent(
          "Email này đã tồn tại. Bạn không thể thay đổi email."
        )
    );
  } else if (!checkOldPass) {
    console.log("Mật khẩu cũ không đúng");
    res.redirect(
      "/home?alertErr=" + encodeURIComponent("Mật khẩu cũ không đúng")
    );
  } else if (valueNewPassword < 6) {
    console.log("Mật khẩu mới lớn hơn 6 kí tự.");

    res.redirect(
      "/home?alertErr=" + encodeURIComponent("Mật khẩu mới nhiều hơn 6 kí tự")
    );
  } else {
    console.log("Mật khẩu cũ đúng");
    let updatedData = {};
    updatedData.name = name;
    updatedData.email = email;
    updatedData.password = valueNewPassword;

    if (req.file && req.file.buffer) {
      updatedData.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    if (name || email || valueOldPassword || valueNewPassword) {
      try {
        const updateUser = await UserModal.findByIdAndUpdate(
          userId,
          updatedData,
          {
            new: true,
          }
        );
        if (!updateUser) {
          res.redirect(
            "/home?alertErr=" +
              encodeURIComponent("Không tìm thấy người dùng. Hãy thử lại.")
          );
        }

        res.redirect("/home");
      } catch (err) {
        res.redirect(
          "/home?alertErr=" +
            encodeURIComponent("Đã có lỗi xảy ra. Hãy thử lại.")
        );
      }
    }
  }
});

module.exports = router;
