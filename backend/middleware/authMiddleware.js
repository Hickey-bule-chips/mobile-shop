import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

//保护对应的路由
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("未授权，Token验证失败");
    }
  }
  //token不存在时
  if (!token) {
    res.status(401);
    throw new Error("未授权，没有Token");
  }
});

//管理员验证中间件
const admin = (req, res, next) => {
  //请求中是否是用户以及是否是管理员用户
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("不是被授权的管理员");
  }
};

export { protect, admin };
