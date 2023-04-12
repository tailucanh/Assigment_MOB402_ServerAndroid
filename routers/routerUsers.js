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
  "/",
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

    if (req.file) {
      if (name || email || password) {
        const checkUser = await UserModal.findOne({ email });
        if (checkUser) {
          res.redirect(
            "/users?alertErr=" +
              encodeURIComponent("Email đã được đăng kí. Hãy chọn email khác.")
          );
        } else {
          const fileData = req.file.buffer;
          const salt = await bcrypt.genSalt(15);
          const bcryptPassWord = await bcrypt.hash(password, salt);
          const newUser = new UserModal({
            avatar: { data: fileData, contentType: req.file.mimetype },
            name: name,
            email: email,
            password: bcryptPassWord,
            userAuthorization: permission,
          });
          const token = await newUser.generateAuthToken();
          newUser.token = token;
          try {
            await newUser.save();
            res.redirect(
              "/users?alertSuccess=" +
                encodeURIComponent("Thêm người dùng thành công.")
            );
          } catch (err) {
            res.redirect(
              "/users?alertErr=" +
                encodeURIComponent("Đã có lỗi xảy ra. Hãy thử lại.")
            );
          }
        }
      }
    } else {
      if (name || email || password) {
        const checkUser = await UserModal.findOne({ email });
        if (checkUser) {
          res.redirect(
            "/users?alertErr=Email đã được đăng kí. Hãy chọn email khác."
          );
        } else {
          const salt = await bcrypt.genSalt(15);
          const bcryptPassWord = await bcrypt.hash(password, salt);
          const newUser = new UserModal({
            avatar: { data: "", contentType: "" },
            name: name,
            email: email,
            password: bcryptPassWord,
            userAuthorization: permission,
          });
          const token = await newUser.generateAuthToken();
          console.log(newUser);
          try {
            await newUser.save();
            res.redirect(
              "/users?alertSuccess=" +
                encodeURIComponent("Thêm người dùng thành công.")
            );
          } catch (err) {
            res.redirect(
              "/users?alertErr=" +
                encodeURIComponent("Đã có lỗi xảy ra. Hãy thử lại.")
            );
          }
        }
      }
    }
  }
);

router.get("/delete/:id", middleware, async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserModal.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.redirect(
        "/users?alertErr=" +
          encodeURIComponent("Không tìm thấy người dùng. Hãy thử lại.")
      );
    }
    res.redirect(
      "/users?alertSuccess=" + encodeURIComponent("Xóa người dùng thành công.")
    );
  } catch (err) {
    res.redirect(
      "/users?alertErr=" + encodeURIComponent("Đã có lỗi xảy ra. Hãy thử lại.")
    );
  }
});

router.post(
  "/update/:id",
  upload.single("avatar"),
  middleware,
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
    const user = await UserModal.findOne({ _id: userId });
    const checkUser = await UserModal.findOne({ email });
    if (checkUser && user.email != checkUser.email) {
      res.redirect(
        "/users?alertErr=" +
          encodeURIComponent("Email đã tồn tại. Không thể sửa")
      );
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
      if (name || email) {
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
              "/users?alertErr=" +
                encodeURIComponent("Không tìm thấy người dùng. Hãy thử lại.")
            );
          }
          console.log(updatedData);
          res.redirect(
            "/users?alertSuccess=" +
              encodeURIComponent("Cập nhật người dùng thành công.")
          );
        } catch (err) {
          res.redirect(
            "/users?alertErr=" +
              encodeURIComponent("Đã có lỗi xảy ra. Hãy thử lại.")
          );
        }
      }
    }
  }
);

module.exports = router;
