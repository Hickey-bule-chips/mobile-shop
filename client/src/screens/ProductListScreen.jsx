import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../compnents/Message";
import Loader from "../compnents/Loader";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constant/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: sussceeDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      navigate("/login");
    }
    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    sussceeDelete,
    successCreate,
    createdProduct,
  ]);

  //删除商品函数
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure delete this product")) {
      //删除商品
      dispatch(deleteProduct(id));
    }
  };
  //创建产品函数
  const createProductHandler = () => {
    //创建商品
    dispatch(createProduct());
  };
  return (
    <>
      <Row>
        <Col>
          <h1>商品列表</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            创建商品
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>商品ID</th>
              <th>商品名称</th>
              <th>商品价格</th>
              <th>商品类型</th>
              <th>商品品牌</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    style={{ marginLeft: "6px" }}
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;
