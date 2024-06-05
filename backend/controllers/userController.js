import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc 注册新用户
//@route POST/api/users
//@access pulic
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const nameExists = await User.findOne({ name });
  const userExists = await User.findOne({ email });

  //用户名已存在
  if (nameExists) {
    res.status(400);
    throw new Error("用户名已注册");
  }

  //邮箱已存在
  if (userExists) {
    res.status(400);
    throw new Error("邮箱已注册");
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

//@desc    获取更新用户资料
//@route   PUT/api/users/profile
//@access  私密
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  //获取更新后的用户资料
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    //返回更新后的用户信息
    res.json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      token: generateToken(updateUser._id),
    });
  } else {
    res.status(404);
    throw new Error("用户不存在");
  }
});

//@desc    获取所有注册用户
//@route   GET/api/users
//@access  私密(仅限管理员)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@desc    删除注册用户
//@route   DELETE/api/users/:id
//@access  私密(仅限管理员)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: user });
    res.json({ message: "用户已删除" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
