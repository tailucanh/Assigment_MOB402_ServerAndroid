const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  type: {
    type: String,
  },
  desc: {
    type: String,
  },
});

const productModel = new mongoose.model("product", productSchema);

module.exports = productModel;
