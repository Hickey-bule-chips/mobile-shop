import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../compnents/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import CheckoutSteps from "../compnents/CheckoutSteps";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    navigate("/login/shipping");
  }
  const [paymentMethod, setPaymentMethod] = useState("微信");
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>支付方式</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">选择支付方式</Form.Label>

          <Col>
            <Form.Check
              type="radio"
              label="微信"
              id="微信"
              name="paymentMethod"
              value="微信"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              type="radio"
              label="支付宝"
              id="支付宝"
              name="paymentMethod"
              value="支付宝"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
          继续下一步
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
