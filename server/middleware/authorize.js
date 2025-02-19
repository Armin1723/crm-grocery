const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized, No Token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || decoded.exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          success: false,
          message: "Token Expired. Please Login Again",
        });
      }

      if (decoded?.role === "admin") {
        req.user = decoded;
        return next();
      }

      const user = await User.findById(decoded.id).select("permissions").lean();

      // If permissions have changed, clear token & force logout
      const tokenPermissions = decoded?.permissions.sort().join(",");
      const dbPermissions = user.permissions?.sort().join(",");

      if (tokenPermissions !== dbPermissions) {
        res.cookie("token", "", {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          expires: new Date(0),
        });
        return res.status(401).json({
          success: false,
          message: "Permissions changed. Please log in again.",
        });
      }

      // Check if user has at least one required permission
      const hasPermission = requiredPermissions.some((perm) =>
        user?.permissions.includes(perm)
      );

      if (!hasPermission) {
        return res
          .status(403)
          .json({ success: false, message: "Access Denied." });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };
};

module.exports = authorize;
