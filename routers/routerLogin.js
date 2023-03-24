const express = require("express");
const router = express.Router();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
// const { sendAlert } = require("../public/Js/helpers.js");
var dir = "D:/Android/AndroidPoly/MOB402_Android_Server/Assigment/uploads";
var users = [
  {
    id: 1,
    email: "abc@gmail.com",
    password: "1234",
    name: "Lục Anh Tài",
    avatar: undefined,
  },
  {
    id: 2,
    email: "taibeo456@gmail.com",
    password: "1234",
    name: "Tài Smile",
    avatar: undefined,
  },
  {
    id: 3,
    email: "12avs@gmail.com",
    password: "1234",
    name: "Nguyen van a",
    avatar: undefined,
  },
];

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
app.use(bodyParser.urlencoded({ extended: true }));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let fileName = file.originalname;
    arr = fileName.split(".");
    let newFileName = "";
    for (let i = 0; i < arr.length; i++) {
      if (i != arr.length - 1) {
        newFileName += arr[i] + ".";
      } else {
        newFileName += "-" + Date.now() + "." + arr[i];
      }
    }

    cb(null, newFileName);
  },
});

var upload = multer({
  storage: storage,
}).single("avatar");

router.get("/", (req, res) => {
  res.render("welcome_screen", { title: "Welcome" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.get("/users", (req, res) => {
  res.render("users", { title: "User", users });
});

router.post("/register", (req, res) => {
  upload(req, res, function (err) {
    const { email, password, name } = req.body;
    const avatar = null;
    if (!req.file) {
      const avatar = req.file;
    }
    const emailRegex = /\S+@\S+\.\S+/;

    // if (!name) {
    //   return res.render("register", {
    //     errName: "Hãy nhập họ và tên ",
    //   });
    // } else if (!email) {
    //   return res.render("register", {
    //     name: name,
    //     errEmail: "Hãy nhập email",
    //   });
    // } else if (!emailRegex.test(email)) {
    //   return res.render("register", {
    //     name: name,
    //     email: email,
    //     errEmail: "Hãy nhập email đúng định dạng",
    //   });
    // } else if (!password) {
    //   return res.render("register", {
    //     name: name,
    //     email: email,
    //     errPass: "Hãy nhập password",
    //   });
    // } else if (password.length < 6) {
    //   return res.render("register", {
    //     name: name,
    //     email: email,
    //     password: password,
    //     errPass: "Hãy nhập password trên 6 kí tự",
    //   });
    // }
    const id = users.length + 1;
    const user = { id, email, password, name, avatar };
    users.push(user);

    res.redirect("/login");
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(400).send("Tài khoản không tồn tại!");
    return;
  }

  if (user.password !== password) {
    res.status(400).send("Mật khẩu không đúng!");
    return;
  }

  res.redirect("/admin");
});

module.exports = router;
