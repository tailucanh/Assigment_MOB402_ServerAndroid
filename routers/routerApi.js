const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const middleware = require("../helpers/middleware");
const UserModal = require("../models/User");
const bodyParser = require("body-parser");
const ProductModel = require("../models/Product");
const bcrypt = require("bcrypt");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/users", async (req, res) => {
  var arrAllUsers = await UserModal.find().lean();

  if (arrAllUsers.length > 0) {
    for (let user of arrAllUsers) {
      const base64Image = user.avatar.data.toString("base64");
      user.avatar.data = base64Image;
    }
  }

  res.json(arrAllUsers);
});
router.get("/products", async (req, res) => {
  var arrProducts = await ProductModel.find().lean();
  if (arrProducts.length > 0) {
    for (let product of arrProducts) {
      const base64Image = product.image.data.toString("base64");
      product.image.data = base64Image;
    }
  }

  res.json(arrProducts);
});

module.exports = router;
