import React, { useState, useEffect } from "react";
import { Link, useNavigate, useMatch } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
  ListGroup,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../actions/orderActions";
import Message from "../compnents/Message";
import Loader from "../compnents/Loader";

const OrderScreen = () => {
  const {
    params: { id },
  } = useMatch("/order/:id");
  const orderId = id;
  const dispatch = useDispatch();

  //弹出框的状态
  const [show, setShow] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  //计算价格
  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!order || order._id !== orderId) dispatch(getOrderDetails(orderId));
    //eslint-disable-next-line
  }, [order, orderId]);

  //创建开启和关闭弹出框的函数
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>订单号：{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>收货地址</h2>
              <p>
                <strong>收件人地址：</strong>
              </p>
              <p>
                <strong>用户名：</strong>
                {order.user.name}
              </p>
              <p>
                {" "}
                <strong>邮箱：</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                {order.shippingAddress.province}-{order.shippingAddress.city}-
                {order.shippingAddress.address}-{order.shippingAddress.postCode}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  发货时间：{order.DeliveredAt}
                </Message>
              ) : (
                <Message variant="danger">未发货</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>支付方式</h2>
              <p>
                <strong>支付方法：</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">支付时间：{order.PaidAt}</Message>
              ) : (
                <Message variant="danger">待支付</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>商品订单：</h2>
              {order.orderItems.length === 0 ? (
                <Message>购物车为空</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price} = {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
          {/* 右侧部分 */}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>订单详情：</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>商品总价</Col>
                  <Col>{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>运费</Col>
                  <Col>{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>订单总价</Col>
                  <Col>{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  onClick={handleShow}
                  disabled={order.orderItems === 0}
                >
                  去支付
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>订单号：{order._id}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>支付金额：¥{order.totalPrice}</p>
                    <p>支付方式：{order.paymentMethod}</p>
                    <Row>
                      <Col md={6} style={{ textAlign: "center" }}>
                        <Image src="/images/wechat.jpg" />
                        <p>
                          <strong>请扫码</strong>
                        </p>
                      </Col>
                      <Col>
                        <Image src="/images/saoyisao.jpg" />
                      </Col>
                    </Row>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                      关闭
                    </Button>
                  </Modal.Footer>
                </Modal>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
