const Purchase = require("./models/purchase.model");
const { generatePurchaseInvoice } = require("./templates/invoice/purchaseInvoice");

const updatePurchaseInvoice = async () => {
    const purchases = await Purchase.find();

    for (const purchase of purchases) {
        purchase.invoice = await generatePurchaseInvoice(purchase._id);
        console.log("Updated purchase invoice for", purchase._id);
        await purchase.save();
    }
    console.log("Updated all purchase invoices");
}

const PurchaseReturn = require("./models/purchaseReturn.model");
const { generatePurchaseReturnInvoice } = require("./templates/invoice/purchaseReturnInvoice");

const updatePurchaseReturnInvoice = async () => {
    const purchaseReturns = await PurchaseReturn.find();

    for (const purchaseReturn of purchaseReturns) {
        purchaseReturn.invoice = await generatePurchaseReturnInvoice(purchaseReturn._id);
        console.log("Updated purchase return invoice for", purchaseReturn._id);
        await purchaseReturn.save();
    }
    console.log("Updated all purchase return invoices");
}

module.exports = {updatePurchaseInvoice, updatePurchaseReturnInvoice};