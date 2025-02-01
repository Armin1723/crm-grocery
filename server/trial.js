const PurchaseReturn = require("./models/purchaseReturn.model");
const Purchase = require("./models/purchase.model");
const Sale = require("./models/sale.model");
// const saleReturn = require("./models/saleReturn.model");

const generatePurchaseReturnInvoice = require("./templates/invoice/purchaseReturnInvoice");
const generatePurchaseInvoice = require("./templates/invoice/purchaseInvoice");
const generateSaleInvoice = require("./templates/invoice/saleInvoice");
const SalesReturn = require("./models/salesReturn.model");
const Company = require("./models/company.model");
const Inventory = require("./models/inventory.model");
const User = require("./models/user.model");
const Product = require("./models/product.model");
const Customer = require("./models/customer.model");
const Expense = require("./models/expense.model");
// const { generateSaleReturnInvoice } = require("./templates/invoice/saleReturnInvoice");

const updatePurchaseInvoice = async () => {
  const purchases = await Purchase.find();

  for (const purchase of purchases) {
    purchase.invoice = await generatePurchaseInvoice(purchase._id);
    console.log("Updated purchase invoice for", purchase._id);
    await purchase.save();
  }
  console.log("Updated all purchase invoices");
};

const updatePurchaseReturnInvoice = async () => {
  const purchaseReturns = await PurchaseReturn.find();

  for (const purchaseReturn of purchaseReturns) {
    purchaseReturn.invoice = await generatePurchaseReturnInvoice(
      purchaseReturn._id
    );
    console.log("Updated purchase return invoice for", purchaseReturn._id);
    await purchaseReturn.save();
  }
  console.log("Updated all purchase return invoices");
};

const updateSaleInvoice = async (limit = 1) => {
  const sales = await Sale.find().sort({ createdAt: -1 }).limit(limit);

  for (const sale of sales) {
    sale.invoice = await generateSaleInvoice(sale._id);
    console.log("Updated sale invoice for", sale._id);
    await sale.save();
  }
  console.log("Updated all sale invoices");
};

const addCompanyToEverything = async () => {
  const company = await Company.findOne();
  const customers = await Customer.find();
  const purchases = await Purchase.find();
  const purchaseReturns = await PurchaseReturn.find();
  const expenses = await Expense.find();
  const sales = await Sale.find();
  const saleReturns = await SalesReturn.find();
  const inventory = await Inventory.find();
  const users = await User.find();
  const products = await Product.find();

  for (const customer of customers) {
    customer.company = company._id;
    await customer.save();
  }

  for (const purchase of purchases) {
    purchase.company = company._id;
    await purchase.save();
  }

  for (const purchaseReturn of purchaseReturns) {
    purchaseReturn.company = company._id;
    await purchaseReturn.save();
  }

  for (const expense of expenses) {
    expense.company = company._id;
    await expense.save();
  }

  for (const sale of sales) {
    sale.company = company._id;
    await sale.save();
  }

  for (const saleReturn of saleReturns) {
    saleReturn.company = company._id;
    await saleReturn.save();
  }

  for (const user of users) {
    user.company = company._id;
    await user.save();
  }

  for (const product of products) {
    product.company = company._id;
    await product.save();
  }

  for (const item of inventory) {
    item.company = company._id;
    await item.save();
  }

  console.log(
    "Added company to all purchases, purchase returns, sales, and sale returns"
  );
};

module.exports = {
  updatePurchaseInvoice,
  updatePurchaseReturnInvoice,
  updateSaleInvoice,
  addCompanyToEverything,
};
