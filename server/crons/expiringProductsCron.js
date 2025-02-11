require("dotenv").config();
const cron = require("node-cron");
const { sendMail } = require("../helpers");
const expiringProductsTemplateMail = require("../templates/email/expiringProductsTemplateMail");

const Inventory = require("../models/inventory.model");
const Company = require("../models/company.model");
const User = require("../models/user.model");

const matchStage = {
  $match: {
    totalQuantity: { $gt: 0 },
  },
};

//Helper function getExpiringProducts
const getExpiringProducts = async (type, companyId) => {
  const today = new Date();
  let endDate = new Date(today);
  let startDate = new Date(today);

  if (type === "today") {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (type === "week") {
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(today.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
  } else if (type === "month") {
    startDate.setHours(0, 0, 0, 0);
    endDate.setMonth(today.getMonth() + 1);
    endDate.setHours(23, 59, 59, 999);
  }

  const pipeline = [
    matchStage,
    {$match: {company: companyId}},
    { $unwind: "$batches" },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "details",
      },
    },
    {
      $unwind: "$details",
    },
    {
      $match: {
        "batches.expiry": {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        _id: 0,
        product: "$details.name",
        category: "$details.category",
        upid: "$details.upid",
        image: "$details.image",
        expiry: "$batches.expiry",
        secondaryUnit: "$details.secondaryUnit",
        quantity: "$batches.quantity",
        purchaseRate: "$batches.purchaseRate",
        sellingRate: "$batches.sellingRate",
      },
    },
  ];

  const expiringProducts = await Inventory.aggregate(pipeline);

  return expiringProducts;
};

const expiringProductsCron = () => {
  // Run every day at 6:00 AM
  cron.schedule("0 6 * * *", async () => {
    try {
      const companies = await Company.find({
        subscriptionEndDate: { $gte: new Date() },
      });

      companies.forEach(async (company) => {
        const productsExpiringToday = await getExpiringProducts(
          "today",
          company._id
        );
        const admin = await User.findOne({
          company: company._id,
          role: "admin",
        }).select("email");

        let productsExpiringThisWeek = [];
        let productsExpiringThisMonth = [];

        const currentDate = new Date().getDate();
        const currentDay = new Date().getDay();

        // Additional checks for Monday and first day of month
        if (currentDay === 1) {
          // Monday
          productsExpiringThisWeek = await getExpiringProducts(
            "week",
            company._id
          );
        }

        if (currentDate === 1) {
          // First day of month
          productsExpiringThisMonth = await getExpiringProducts(
            "month",
            company._id
          );
        }
        // Only send email if there are expiring products
        if (
          productsExpiringToday.length ||
          productsExpiringThisWeek.length ||
          productsExpiringThisMonth.length
        ) {
          const emailContent = expiringProductsTemplateMail(
            productsExpiringToday,
            productsExpiringThisWeek,
            productsExpiringThisMonth,
            company
          );
          await sendMail(
            admin.email,
            (subject = "Products Expiry Notification"),
            (message = emailContent)
          );

          console.log("Product expiry notification sent successfully");
        } else {
          console.log("No Products Expiring");
        }
      });
    } catch (error) {
      console.error("Error in product expiry notification:", error);
    }
  });
};

module.exports = expiringProductsCron;
