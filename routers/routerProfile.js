const express = require("express");
const router = express.Router();
const middleware = require("../helpers/middleware");
const UserModal = require("../models/User");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
var upload = multer({
  storage: multer.memoryStorage(),
});

router.put("/:id", middleware, upload.single("avatar"), async (req, res) => {
  const userId = req.params.id;
  const { name, email, valueOldPassword, valueNewPassword } = req.body;

  try {
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
    } else {
      const user = await UserModal.findOne({ _id: userId });
      const checkUser = await UserModal.findOne({ email });
      if (checkUser && user.email !== checkUser.email) {
        res.status(400).json({
          success: false,
          message: "Email này đã tồn tại. Bạn không thể thay đổi email.",
        });
      } else {
        let updatedData = {};
        updatedData.name = name;
        updatedData.email = email;

        if (valueOldPassword.length > 0 && valueNewPassword.length > 0) {
          const checkOldPass = await bcrypt.compare(
            valueOldPassword,
            user.password
          );
          if (!checkOldPass) {
            res.status(400).json({
              success: false,
              message: "Mật khẩu cũ không đúng.",
            });
          } else if (valueNewPassword.length >= 6) {
            const salt = await bcrypt.genSalt(15);
            const bcryptPassWord = await bcrypt.hash(valueNewPassword, salt);
            updatedData.password = bcryptPassWord;
            if (req.file && req.file.buffer) {
              updatedData.avatar = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
              };
            }

            await UserModal.findByIdAndUpdate(userId, updatedData, {
              new: true,
            });
            res.status(201).json({
              success: true,
              message: "Cập nhật thông tin thành công.",
            });
          } else {
            res.status(400).json({
              success: false,
              message: "Hãy nhập mật khẩu mới nhiều hơn 6 kí tự.",
            });
          }
        } else {
          if (req.file && req.file.buffer) {
            updatedData.avatar = {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            };
          }

          await UserModal.findByIdAndUpdate(userId, updatedData, {
            new: true,
          });
          res.status(201).json({
            success: true,
            message: "Cập nhật thông tin thành công.",
          });
        }
      }
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra. Hãy thử lại.",
    });
  }
});

module.exports = router;
