import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const secretKey = "terminal-x-secret";

export const register = async (req, res) => {
  const { email, password } = req.body;
  console.log("req",req.body)
  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: 86400 });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
