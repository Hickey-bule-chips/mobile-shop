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

//@desc 删除单个产品
//@route DELETE/api/products/:id
//@access private（管理员)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product });
    res.json({ message: "商品删除成功" });
  } else {
    res.status(404);
    throw new Error("查询不到这个商品");
  }
});

//@desc 创建产品
//@route POST/api/products
//@access private（管理员)
const createProduct = asyncHandler(async (req, res) => {
  //创建一个商品模版
  const product = new Product({
    name: "样品名称",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "样品品牌",
    category: "样品分类",
    countInStock: 0,
    numReviews: 0,
    description: "样品描述",
    rating: 0,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc 更新产品内容
//@route POST/api/products/:id
//@access private（管理员)
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    rating,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.rating = rating;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("查询不到这个商品");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
