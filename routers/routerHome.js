const express = require("express");
const router = express.Router();
const UserModal = require("../models/User");
const app = express();
const { secret } = require("../helpers/api");
const ProductModel = require("../models/Product");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const middleware = require("../helpers/middleware");
const bcrypt = require("bcrypt");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.urlencoded({ extended: true }));
var upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", middleware, async (req, res) => {
  const productsPerPage = 6;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * productsPerPage;

  var arrProduct = await ProductModel.find()
    .lean()
    .skip(skip)
    .limit(productsPerPage);

  const totalProducts = await ProductModel.countDocuments();
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (arrProduct.length > 0) {
    for (let product of arrProduct) {
      const base64Image = product.image.data.toString("base64");
      product.image.data = base64Image;
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
  isUser.id = user._id;
  isUser.name = user.name;
  isUser.email = user.email;
  isUser.isAdmin = user.userAuthorization;
  isUser.avatar = user.avatar;
  isUser.password = user.password;
  if (isUser.avatar.data.length > 13) {
    const base64ImageAvatar = isUser.avatar.data.toString("base64");
    isUser.avatar.data = base64ImageAvatar;
    isUser.avatar.contentType = user.avatar.contentType;
  }

  res.render("home", {
    title: "Home",
    arrProduct,
    prevPage,
    nextPage,
    pages,
    isUser,
  });
});

module.exports = router;
