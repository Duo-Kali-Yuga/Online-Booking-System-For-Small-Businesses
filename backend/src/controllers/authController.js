import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
  
    const { name, email, password, role, adminSecret } = req.body;

    let assignedRole = 'client'; // Default

    // Only promote to admin if the secret key matches
    if (role === 'admin' && adminSecret === process.env.ADMIN_REGISTRATION_KEY) {
      assignedRole = 'admin';
    } else if (role === 'provider') {
      assignedRole = 'provider';
    }

    
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });
    
    console.log(assignedRole)
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  console.log(isMatch)
  console.log(password)
  console.log(user.password)

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user,
  });
};