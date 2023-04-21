const express = require("express");
const router = express.Router();
const { emailAminMain } = require("../helpers/api");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const middleware = require("../helpers/middleware");
const UserModal = require("../models/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", middleware, async (req, res) => {
  const usersPerPage = 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * usersPerPage;

  var arrUsers = await UserModal.find().lean().skip(skip).limit(usersPerPage);

  arrUsers = arrUsers.map((user, index) => {
    user.index = index + 1;
    return user;
  });

  const totalUsers = await UserModal.countDocuments();
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  if (arrUsers.length > 0) {
    for (let user of arrUsers) {
      const base64Image = user.avatar.data.toString("base64");
      user.avatar.data = base64Image;
    }
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push({
      pageNum: i,
      isCurrent: i === page,
    });
  }
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  const user = req.user;
  let isUser = [];
  isUser.name = user.name;
  isUser.email = user.email;
  isUser.isAdmin = user.userAuthorization;
  isUser.avatar = user.avatar;
  if (isUser.avatar.data.length > 13) {
    const base64ImageAvatar = isUser.avatar.data.toString("base64");
    isUser.avatar.data = base64ImageAvatar;
    isUser.avatar.contentType = user.avatar.contentType;
  }
  var alertErr = req.query.alertErr;
  var alertSuccess = req.query.alertSuccess;

  if (isUser.isAdmin) {
    res.render("users", {
      title: "Users",
      active: { users: true },
      arrUsers,
      prevPage,
      nextPage,
      pages,
      isUser,
      totalUsers,
      alertErr,
      alertSuccess,
    });
  } else {
    res.redirect("/home");
  }
});

router.post(
  "/add_user",
  middleware,
  upload.single("avatar"),
  async function (req, res) {
    const { name, email, password } = req.body;
    const selectedOption = req.body["select-permission"];
    let permission = true;
    if (selectedOption == "admin") {
      permission = true;
    } else if (selectedOption == "user") {
      permission = false;
    }
    console.log(req.body);

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
    } else {
      const checkUser = await UserModal.findOne({ email });
      if (checkUser) {
        res.status(400).json({
          success: false,
          message: "Email đã được đăng kí. Hãy chọn email khác.",
        });
      } else {
        const salt = await bcrypt.genSalt(15);
        const bcryptPassWord = await bcrypt.hash(password, salt);
        try {
          if (req.file && req.file.buffer) {
            const fileData = req.file.buffer;
            const newUser = new UserModal({
              avatar: { data: fileData, contentType: req.file.mimetype },
              name: name,
              email: email,
              password: bcryptPassWord,
              userAuthorization: permission,
            });
            const token = await newUser.generateAuthToken();
            newUser.token = token;

            await newUser.save();
            res.status(201).json({
              success: true,
              message: "Thêm người dùng thành công.",
            });
          } else {
            const newUser = new UserModal({
              avatar: { data: "", contentType: "" },
              name: name,
              email: email,
              password: bcryptPassWord,
              userAuthorization: permission,
            });
            const token = await newUser.generateAuthToken();
            newUser.token = token;

            await newUser.save();
            res.status(201).json({
              success: true,
              message: "Thêm người dùng thành công.",
            });
          }
        } catch (err) {
          res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra. Hãy thử lại.",
          });
        }
      }
    }
  }
);

router.delete("/delete_user/:id", middleware, async (req, res) => {
  const userId = req.params.id;

  if (userId.length > 0) {
    try {
      await UserModal.findByIdAndDelete(userId);
      res.status(201).json({
        success: true,
        message: "Xóa người dùng thành công.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra. Hãy thử lại.",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Không tìm thấy người dùng. Hãy thử lại.",
    });
  }
});

router.put(
  "/update_user/:id",
  middleware,
  upload.single("avatar"),

  async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const selectedValue = req.body["selectedValue"];

    let isPermission = true;
    if (selectedValue == "admin") {
      isPermission = true;
    } else if (selectedValue == "user") {
      isPermission = false;
    }
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
      if (userId.length > 0) {
        try {
          const user = await UserModal.findOne({ _id: userId });
          const checkUser = await UserModal.findOne({ email });
          if (checkUser && user.email != checkUser.email) {
            res.status(400).json({
              success: false,
              message: "Email đã tồn tại. Không thể sửa",
            });
          } else {
            let updatedData = {};
            updatedData.name = name;
            updatedData.email = email;
            updatedData.userAuthorization = isPermission;

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
              message: "Sửa thông tin thành công.",
            });
          }
        } catch (err) {
          res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra. Hãy thử lại.",
          });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Không tìm thấy người dùng. Hãy thử lại",
        });
      }
    }
  }
);

router.get("/search", middleware, async (req, res) => {
  const keyword = decodeURIComponent(req.query.search_input);
  console.log(keyword);
  const regex = new RegExp(keyword, "i");
  console.log(regex);
  try {
    var arrUsers = await UserModal.find({ name: regex }).lean();

    arrUsers = arrUsers.map((user, index) => {
      user.index = index + 1;
      return user;
    });
    const totalUsers = arrUsers.length;

    if (arrUsers.length > 0) {
      for (let user of arrUsers) {
        const base64ImageAvatar = user.avatar.data.toString("base64");
        user.avatar.data = base64ImageAvatar;
        user.avatar.contentType = user.avatar.contentType;
      }
    }

    res.render("users", {
      title: "Users",
      arrUsers,
      totalUsers,
      keyword,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra.Hãy thử lại",
    });
  }
});

module.exports = router;
