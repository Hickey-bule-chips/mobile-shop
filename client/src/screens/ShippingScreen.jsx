import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../compnents/FormContainer";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../compnents/CheckoutSteps";

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postCode, setPostCode] = useState(shippingAddress.postCode);
  const [province, setProvince] = useState(shippingAddress.province);

  const navigate = useNavigate();
  //提交收货地址函数
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postCode, province }));
    navigate("/payment");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>收货地址</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>详情地址：</Form.Label>
          <Form.Control
            type="text"
            placeholder="请输入详细地址，如街道，小区单元和楼栋，门牌号"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>所在城市或地区：</Form.Label>
          <Form.Control
            type="text"
            placeholder="请输入所在城市或地区"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="postCode">
          <Form.Label>邮政编码：</Form.Label>
          <Form.Control
            type="text"
            placeholder="请输入邮政编码"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="province">
          <Form.Label>所在省份：</Form.Label>
          <Form.Control
            type="text"
            placeholder="请输入所在省份"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
          继续下一步
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
