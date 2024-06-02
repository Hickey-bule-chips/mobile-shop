import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc 请求所有产品
//@route GET/api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc 请求单个产品
//@route GET/api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("查询不到这个商品");
  }
});

export { getProducts, getProductById };
