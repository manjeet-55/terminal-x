// authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("req.headers", req.headers.token)
  const { token } = req.headers;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
