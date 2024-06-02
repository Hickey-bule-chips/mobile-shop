import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc 注册新用户
//@route POST/api/users
//@access pulic
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // const nameExists=await User.findOne({name});
  const userExists = await User.findOne({ email });
  //用户已存在
  if (userExists) {
    res.status(400);
    throw new Error("用户已注册");
  }
  //没有注册，就注册新用户
  const user = await User.create({ name, email, password });
  //如果新用户存在
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("无效的用户信息");
  }
});

//@desc 用户身份验证 & 获取Token
//@route POST/api/users/login
//@access pulic
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("邮箱或者密码错误");
  }
});

//@desc    获取登录成功的用户详情
//@route   GET/api/users/profile
//@access  私密
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("用户不存在");
  }
});

export { registerUser, authUser, getUserProfile };
