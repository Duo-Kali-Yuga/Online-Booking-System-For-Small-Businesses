import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized" });

    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isProvider = (req, res, next) => {
  // Debug: See what role is actually being passed
  console.log("User role in middleware:", req.user?.role);
  
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Only providers can perform this action." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      next();
  } else {
      res.status(403).json({ message: "Not authorized as an admin" });
  }
  next();
};