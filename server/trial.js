const PurchaseReturn = require("./models/purchaseReturn.model");
const Purchase = require("./models/purchase.model");
const Sale = require("./models/sale.model");
const SalesReturn = require("./models/salesReturn.model");

const generatePurchaseReturnInvoice = require("./templates/invoice/purchaseReturnInvoice");
const generatePurchaseInvoice = require("./templates/invoice/purchaseInvoice");
const generateSaleInvoice = require("./templates/invoice/saleInvoice");
const generateSalesReturnInvoice = require("./templates/invoice/saleReturnInvoice");

const updatePurchaseInvoice = async () => {
  const purchases = await Purchase.find().limit(1).sort({ createdAt: -1 });

  for (const purchase of purchases) {
  purchase.invoice = await generatePurchaseInvoice(purchase?._id);
  console.log("Updated purchase invoice for", purchase?._id);
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
  const sales = await Sale.find();

  for (const sale of sales) {
    sale.invoice = await generateSaleInvoice(sale._id);
    console.log("Updated sale invoice for", sale._id);
    await sale.save();
  }
  console.log("Updated all sale invoices");
};

const updateSaleReturnInvoice = async () => {
  const salesReturns = await SalesReturn.find();

  for (const salesReturn of salesReturns) {
    salesReturn.invoice = await generateSalesReturnInvoice(salesReturn._id);
    console.log("Updated sale return invoice for", salesReturn._id);
    await salesReturn.save();
  }
  console.log("Updated all sale return invoices");
};

module.exports = {
  updatePurchaseInvoice,
  updatePurchaseReturnInvoice,
  updateSaleInvoice,
  updateSaleReturnInvoice,
};
