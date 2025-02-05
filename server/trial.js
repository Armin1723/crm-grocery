const PurchaseReturn = require("./models/purchaseReturn.model");
const Purchase = require("./models/purchase.model");
const Sale = require("./models/sale.model");

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
const Supplier = require("./models/supplier.model");
const generateSalesReturnInvoice = require("./templates/invoice/saleReturnInvoice");
const { sendMail } = require("./helpers");
const expiringProductsTemplateMail = require("./templates/email/expiringProductsTemplateMail");
const followUpPaymentMailTemplate = require("./templates/email/followUpPaymentMailTemplate");
const lowStockMailTemplate = require("./templates/email/lowStockMailTemplate");
const passwordResetMailTemplate = require("./templates/email/passwordResetMailTemplate");
const registerMailTemplate = require("./templates/email/registerMailTemplate");
const saleInvoiceMailTemplate = require("./templates/email/saleInvoiceMailTemplate");
const saleReturnInvoiceMailTemplate = require("./templates/email/saleReturnInvoiceMailTemplate");
const stockAlertMailTemplate = require("./templates/email/stockAlertMailTemplate");
const welcomeEmployeeMail = require("./templates/email/welcomeEmployeeMail");

const updateLastPurchaseInvoice = async () => {
  const purchase = await Purchase.findOne().sort({ createdAt: -1 });
  purchase.invoice = await generatePurchaseInvoice(purchase._id);
  await purchase.save();
  console.log("Updated last purchase invoice");
};
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
  const sales = await Sale.find().sort({ createdAt: -1 })

  for (const sale of sales) {
    sale.invoice = await generateSaleInvoice(sale._id);
    console.log("Updated sale invoice for", sale._id);
    await sale.save();
  }
  console.log("Updated all sale invoices");
};

const updateSalesReturnInvoice = async () => {
  const saleReturns = await SalesReturn.find();

  for(const salesReturn of saleReturns) {
    salesReturn.invoice = await generateSalesReturnInvoice(salesReturn._id);
    console.log("Updated sale return invoice for", salesReturn._id);
    await salesReturn.save();
  }
  console.log("Updated all sale return invoices");
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
  const suppliers = await Supplier.find();

  // for (const customer of customers) {
  //   customer.company = company._id;
  //   await customer.save();
  // }

  // for (const purchase of purchases) {
  //   purchase.company = company._id;
  //   await purchase.save();
  // }

  // for (const purchaseReturn of purchaseReturns) {
  //   purchaseReturn.company = company._id;
  //   await purchaseReturn.save();
  // }

  // for (const expense of expenses) {
  //   expense.company = company._id;
  //   await expense.save();
  // }

  // for (const sale of sales) {
  //   sale.company = company._id;
  //   await sale.save();
  // }

  // for (const saleReturn of saleReturns) {
  //   saleReturn.company = company._id;
  //   await saleReturn.save();
  // }

  // for (const user of users) {
  //   user.company = company._id;
  //   await user.save();
  // }

  // for (const product of products) {
  //   product.company = company._id;
  //   await product.save();
  // }

  // for (const item of inventory) {
  //   item.company = company._id;
  //   await item.save();
  // }

  for (const supplier of suppliers) {
    supplier.company = company._id;
    await supplier.save();
  }

  console.log(
    "Added company to all purchases, purchase returns, sales, and sale returns"
  );
};

const sendTestMails = async () => {  
  const recipient = "alam.airuz23@gmail.com";
  const purchase = await Purchase.findOne().sort({ createdAt: -1 }).lean();
  const sale = await Sale.findOne().sort({ createdAt: -1 }).populate("products.product").lean();
  const saleReturn = await SalesReturn.findOne().sort({ createdAt: -1 }).populate("products.product").lean();
  const product = await Product.findOne().lean();
  const employee = await User.findOne({role: "employee"}).lean();
  const company = await Company.findOne().sort({createdAt: -1}).lean();

  sendMail(
    recipient,
    "Follow Up Payment Reminder",
    followUpPaymentMailTemplate("abs", 1000, purchase._id, company) 
  );

  sendMail(
    recipient,
    "Low Stock Alert",
    lowStockMailTemplate("test product", 10, company)
  );

  sendMail(
    recipient,
    "Password Reset",
    passwordResetMailTemplate("Test User", "768755", company)
  );

  sendMail(
    recipient,
    "Register Mail",
    registerMailTemplate("Test User", company)
  );  

  sendMail(
    recipient,
    "Sale Return Invoice Mail",
    saleReturnInvoiceMailTemplate(saleReturn, company)
  );

  sendMail(
    recipient,
    "Sale Invoice Mail",
    saleInvoiceMailTemplate(sale, company)
  );

  sendMail(
    recipient,
    "Stock Alert Mail",
    stockAlertMailTemplate(product, company)
  );

  sendMail(
    recipient,
    "Welcome Employee Mail",
    welcomeEmployeeMail(employee, company)
  );
};


module.exports = {
  updateLastPurchaseInvoice,
  updatePurchaseInvoice,
  updatePurchaseReturnInvoice,
  updateSaleInvoice,
  updateSalesReturnInvoice,
  addCompanyToEverything,
  sendTestMails,
};
