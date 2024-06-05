import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../compnents/Message";
import Loader from "../compnents/Loader";
import { getUserDetails, updateUser } from "../actions/userActions";
import FormContainer from "../compnents/FormContainer";
import { USER_UPDATE_RESET } from "../constant/userConstants";

const UserEditScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  //   const {
  //     params: { id },
  //   } = useMatch("/admin/userlist/:id/edit");
  //   const userId = id;
  const { id } = useParams();
  const userId = id;

  const navigate = useNavigate();

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, user, userId, successUpdate, navigate]);
  //表单提交函数
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };
  return (
    <FormContainer>
      <Link to="/admin/userlist" className="btn btn-dark my-3">
        返回上一页
      </Link>
      <h1>编辑用户界面</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>用户名：</Form.Label>
            <Form.Control
              type="name"
              placeholder="请输入用户名"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>邮箱地址：</Form.Label>
            <Form.Control
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="isAdmin">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              style={{ marginTop: "6px" }}
              onChange={(e) => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>
          <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
            更新信息
          </Button>
        </Form>
      )}
    </FormContainer>
  );
};
export default UserEditScreen;
