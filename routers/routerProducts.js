const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const { secret } = require("../helpers/api");
const cookieParser = require("cookie-parser");
const ProductModel = require("../models/Product");
const middleware = require("../helpers/middleware");

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

var upload = multer({
  storage: multer.memoryStorage(),
});

router.get("/", middleware, async (req, res) => {
  const productsPerPage = 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * productsPerPage;

  var arrProduct = await ProductModel.find()
    .lean()
    .skip(skip)
    .limit(productsPerPage);

  arrProduct = arrProduct.map((product, index) => {
    product.index = index + 1;
    return product;
  });
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
  isUser.name = user.name;
  isUser.email = user.email;
  isUser.isAdmin = user.userAuthorization;
  isUser.avatar = user.avatar;
  if (isUser.avatar.data.length > 13) {
    const base64ImageAvatar = isUser.avatar.data.toString("base64");
    isUser.avatar.data = base64ImageAvatar;
    isUser.avatar.contentType = user.avatar.contentType;
  }

  if (isUser.isAdmin) {
    res.render("products", {
      title: "Products",
      arrProduct,
      prevPage,
      nextPage,
      pages,
      isUser,
      totalProducts,
    });
  } else {
    res.redirect("/home");
  }
});

router.post(
  "/add_product",
  middleware,
  upload.single("img_product"),
  async function (req, res) {
    const { name, price, type, desc } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên sản phẩm.",
      });
    } else if (!price) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập giá sản phẩm.",
      });
    } else if (Number(price) < 0) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập giá lớn hơn 0đ.",
      });
    } else if (!type) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập loại sản phẩm.",
      });
    } else {
      try {
        if (req.file && req.file.buffer) {
          const fileData = req.file.buffer;
          const product = new ProductModel({
            image: { data: fileData, contentType: req.file.mimetype },
            name: name,
            price: price,
            type: type,
            desc: desc,
          });

          await product.save();
          res.status(200).json({
            success: true,
            message: "Thêm sản phẩm thành công.",
          });
        } else {
          const product = new ProductModel({
            image: { data: "", contentType: "" },
            name: name,
            price: price,
            type: type,
            desc: desc,
          });
          await product.save();
          res.status(201).json({
            success: true,
            message: "Thêm sản phẩm thành công.",
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
);

router.delete("/delete_product/:id", middleware, async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  if (productId.length > 0) {
    try {
      await ProductModel.findByIdAndDelete(productId);
      res.status(201).json({
        success: true,
        message: "Xóa sản phẩm thành công.",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Đã có lỗi xảy ra. Hãy thử lại.",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Không tìm thấy sản phẩm. Hãy thử lại.",
    });
  }
});

router.put(
  "/update_product/:id",
  middleware,
  upload.single("img_product"),
  async (req, res) => {
    const productId = req.params.id;
    const { name, price, type, desc } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên sản phẩm.",
      });
    } else if (!price) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập giá sản phẩm.",
      });
    } else if (Number(price) < 0) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập giá lớn hơn 0đ.",
      });
    } else if (!type) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập loại sản phẩm.",
      });
    } else {
      if (productId.length > 0) {
        let updatedData = {};
        updatedData.name = name;
        updatedData.price = price;
        updatedData.type = type;
        updatedData.desc = desc;
        if (req.file && req.file.buffer) {
          updatedData.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          };
        }
        try {
          await ProductModel.findByIdAndUpdate(productId, updatedData, {
            new: true,
          });

          res.status(201).json({
            success: true,
            message: "Cập nhật sản phẩm thành công.",
          });
        } catch (err) {
          res.status(500).json({
            success: false,
            message: "Đã có lỗi xảy ra. Hãy thử lại.",
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: "Không tìm thấy sản phẩm. Hãy thử lại.",
        });
      }
    }
  }
);

router.get("/search", async (req, res) => {
  const searchTerm = req.query.searchTerm;
  console.log(searchTerm);
  const regex = new RegExp(searchTerm.toString().trim(), "i");
  try {
    const arrProduct = await ProductModel.find({ name: regex }).lean();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra.Hãy thử lại",
    });
  }
});

module.exports = router;
