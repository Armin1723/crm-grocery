require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectToDB = require("./db");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler.js");
const { loadSubscriptionsToCache } = require("./helpers/subscriptionCache.js");
const dailySubscriptionsCacheLoadCron = require("./crons/dailySubscriptionsCacheLoadCron.js");
const expiringProductsCron = require("./crons/expiringProductsCron.js");
const rateLimit = require("express-rate-limit");

const app = express();

const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 60, 
    message: "Too many requests, please try again later.",
  })
);

// Database Connection
connectToDB();

// Routes
app.use("/api/v1/products", require("./routes/product.routes.js"));
app.use("/api/v1/purchases", require("./routes/purchase.routes.js"));
app.use("/api/v1/suppliers", require("./routes/supplier.routes.js"));
app.use("/api/v1/employees", require("./routes/employee.routes.js"));
app.use("/api/v1/inventory", require("./routes/inventory.routes.js"));
app.use("/api/v1/reports", require("./routes/report.routes.js"));
app.use("/api/v1/sales", require("./routes/sale.routes.js"));
app.use("/api/v1/stats", require("./routes/stat.routes.js"));
app.use("/api/v1/auth", require("./routes/auth.routes.js"));
app.use("/api/v1/expenses", require("./routes/expense.routes.js"));
app.use("/api/v1/customers", require("./routes/customer.routes.js"));
app.use("/api/v1/companies", require("./routes/company.routes.js"));

// Support Panel Routes
app.use("/api/v1/support", require("./routes/support.routes.js"));

// Server
app.get("/", (req, res) => {
  res.send("Hello World from CRM API");
});

// Load Subscription Cache
loadSubscriptionsToCache();

// Cron Jobs
dailySubscriptionsCacheLoadCron();
expiringProductsCron();

// Error Handler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
