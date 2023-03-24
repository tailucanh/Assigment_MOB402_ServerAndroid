const express = require("express");
const router = express.Router();
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
var dir = "D:/Android/AndroidPoly/MOB402_Android_Server/Assigment/uploads";

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
}).single("img_product");

var listProduct = [
  {
    id: 1,
    imgProduct: "",
    name: "Áo khoác",
    price: 200000,
    type: "Áo",
    client: "Lê Văn A",
    description: "",
  },
  {
    id: 1,
    imgProduct: "",
    name: "Quần baggy",
    price: 500000,
    type: "Quần",
    client: "Lê Văn B",
    description: "",
  },
];

router.get("/", (req, res) => {
  res.render("products", {
    title: "Products",
    active: { products: true },
    listProduct,
  });
});

router.post("/", function (req, res) {
  upload(req, res, function (err) {
    let img = req.file;

    const { name, price, type_product, client, desc } = req.body;
    const id = listProduct.length + 1;
    const imgProduct = img.path;
    const product = {
      id,
      imgProduct,
      name,
      price,
      type_product,
      client,
      desc,
    };
    if (name || price || type_product) {
      listProduct.push(product);
      console.log(listProduct);

      res.redirect("/products");
    }
  });
});
router.get("/delete/:id", function (req, res) {
  var id = req.params.id;
  listProduct = listProduct.filter(function (product) {
    return product.id != id;
  });
  res.redirect("/products");
});

router.get("/edit/:id", function (req, res) {
  const productId = req.params.id;
  const product = listProduct.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).send("Product not found");
  }
  console.log(product);

  res.render("/products", { listProduct: listProduct, editProduct: product });
});

router.post("/edit", (req, res) => {
  upload(req, res, function (err) {
    const { name, price, type_product, client, desc } = req.body;
    const productId = parseInt(req.params.id);
    const product = listProduct.find((p) => p.id === productId);
    let imgProduct = req.file;

    product.imgProduct = imgProduct;
    product.name = name;
    product.price = price;
    product.client = client;
    product.type_product = type_product;
    product.desc = desc;

    if (name || price || type_product) {
      console.log(listProduct);
      res.redirect("/products");
    }
  });
});

module.exports = router;
