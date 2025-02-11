require("dotenv").config();
const cron = require("node-cron");
const { sendMail } = require("../helpers");
const expiringProductsTemplateMail = require("../templates/email/expiringProductsTemplateMail");

const Inventory = require("../models/inventory.model");

const matchStage = {
  $match: {
    totalQuantity: { $gt: 0 },
  },
};

//Helper function getExpiringProducts
const getExpiringProducts = async (type) => {
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
    {$unwind: "$batches"},
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
  cron.schedule("* 6 * * *", async () => {
    try {
      const productsExpiringToday = await getExpiringProducts("today");

      let productsExpiringThisWeek = [];
      let productsExpiringThisMonth = [];

      // Additional checks for Monday and first day of month
        if (currentDay === 1) {
      // Monday
      productsExpiringThisWeek = await getExpiringProducts("week");
        }

        if (currentDate === 1) {
      // First day of month
      productsExpiringThisMonth = await getExpiringProducts("month");
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
          productsExpiringThisMonth
        );
        await sendMail(
          process.env.ADMIN_EMAIL,
          (subject = "Products Expiry Notification"),
          (message = emailContent),
        );

        console.log("Product expiry notification sent successfully");
      } else {
        console.log("No Products Expiring");
      }
    } catch (error) {
      console.error("Error in product expiry notification:", error);
    }
  });
};

module.exports = expiringProductsCron;
