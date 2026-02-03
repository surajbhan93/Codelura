import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  let token = null;

  // 1️⃣ Authorization header (Bearer)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Cookie based auth (auth_token)
  if (!token && req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ attach user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
/**
 * ===============================
 * AUTH OPTIONAL (LOGIN OPTIONAL)
 * ===============================
 */
export const authOptional = async (req, res, next) => {
  try {
    const token =
      req.cookies?.auth_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    req.user = null;
    next();
  }
};