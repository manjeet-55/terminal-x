import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }
  const token = authHeader.split(" ")[1];

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
