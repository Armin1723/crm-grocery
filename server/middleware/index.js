const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

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

const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = await User.findById(decoded.id).select("role");
    if (userRole.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action.",
      });
    }
    req.user = decoded;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isSubscriptionActive = async (req, res, next) => {
  const companyId = req.user.company;

  if (!companyId) {
    return res.status(403).json({ message: "Company not found" });
  }

  const subscription = global.subscriptionsCache.get(companyId);

  if (!subscription || new Date(subscription.endDate) < new Date()) {
    return res
      .status(403)
      .json({ message: "Subscription expired. Contact Sales." });
  }

  next();
};

const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.SUPPORT_API_KEY) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  next();
};

module.exports = { isLoggedIn, isAdmin, isSubscriptionActive, verifyApiKey };
