require("dotenv").config();
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
    try {
      const { token } = req.cookies;
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || decoded.exp < Date.now().valueOf() / 1000) {
        return res
          .status(401)
          .json({ success: false, message: "Token Expired. Please Login Again" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  module.exports = { isLoggedIn };