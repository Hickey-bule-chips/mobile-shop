import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useMatch } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../compnents/Message";
import Loader from "../compnents/Loader";
import { listProductDetails, updateProduct } from "../actions/productActions";
import FormContainer from "../compnents/FormContainer";
import { PRODUCT_UPDATE_RESET } from "../constant/productConstants";

const ProductEditScreen = () => {
  // const {
  //   params: { id },
  // } = useMatch("/admin/product/:id/edit");
  // const productId = id;
  const { id } = useParams();
  const productId = id;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const navigate = useNavigate();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, navigate, successUpdate]);
  //表单提交函数
  const submitHandler = (e) => {
    e.preventDefault();
    //dispatch 更新产品函数
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    //获取用户选择上传的文件
    const file = e.target.files[0];
    //实例化formData表单数据对象
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multerpart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <FormContainer>
      <Link to="/admin/productlist" className="btn btn-dark my-3">
        返回上一页
      </Link>
      <h1>编辑产品界面</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>商品名称：</Form.Label>
            <Form.Control
              type="name"
              placeholder="请输入商品名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="price">
            <Form.Label>商品价格：</Form.Label>
            <Form.Control
              type="number"
              placeholder="请输入商品价格"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>图片：</Form.Label>
            <Form.Control
              type="text"
              placeholder="请输入图片路径"
              value={image}
              style={{ marginBottom: "10px" }}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              type="file"
              aria-label="选择上传图片"
              onChange={uploadFileHandler}
            />
            {uploading && <Loader />}
          </Form.Group>
          <Form.Group controlId="brand">
            <Form.Label>商品品牌：</Form.Label>
            <Form.Control
              type="text"
              placeholder="请输入商品品牌名称"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="countInStock">
            <Form.Label>产品库存：</Form.Label>
            <Form.Control
              type="number"
              placeholder="请输入库存数量"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>商品种类：</Form.Label>
            <Form.Control
              type="text"
              placeholder="请输入商品种类"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>商品描述：</Form.Label>
            <Form.Control
              type="text"
              placeholder="请输入商品描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
            更新信息
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};

export default ProductEditScreen;
