require("dotenv").config();

const cron = require("node-cron");

const { sendMail } = require("../helpers");
const Inventory = require("../models/inventory.model");
const lowStockProductsMailTemplate = require("../templates/email/lowstockProductsMailTemplate");

const inventoryAggregation = [
  {
    $lookup: {
      from: "products",
      localField: "product",
      foreignField: "_id",
      as: "product",
    },
  },
  {
    $unwind: "$product", // Unwind since lookup returns an array
  },
  {
    $match: {
      "product.stockAlert.preference": true,
    },
  },
  {
    $match: {
      $expr: {
        $gt: ["$product.stockAlert.quantity", "$totalQuantity"],
      },
    },
  },
  {
    $lookup: {
      from: "companies",
      localField: "company",
      foreignField: "_id",
      as: "company",
    },
  },
  {
    $unwind: {
      path: "$company",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: "$company._id",
      companyDetails: {
        $first: "$company",
      },
      products: {
        $push: {
          product: "$product",
          quantity: "$totalQuantity",
        },
      },
    },
  },
];

const inventoryAlertCron = async () => {
  cron.schedule("0 6 * * *", async () => {
    try {
      const inventories = await Inventory.aggregate(inventoryAggregation);

      inventories.forEach(async (inventory) => {
        const { companyDetails: company, products } = inventory;

        if (company.email) {
          // Send email to the company's admin
          await sendMail(
            (to = company?.email),
            (subject = "Product Stock Alert"),
            (message = lowStockProductsMailTemplate(products, company))
          );
        }
      });
    } catch (error) {
      console.error("Error in product stock alert notification:", error);
    }
  });
};

module.exports = inventoryAlertCron;
