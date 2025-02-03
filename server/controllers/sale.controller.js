const { sendMail, mergeBatchesHelper } = require("../helpers");
const Inventory = require("../models/inventory.model");
const Sale = require("../models/sale.model");
const Customer = require("../models/customer.model");
const SalesReturn = require("../models/salesReturn.model");
const lowStockMailTemplate = require("../templates/email/lowStockMailTemplate");
const generateSalesReturnInvoice = require("../templates/invoice/saleReturnInvoice");
const generateSaleInvoice = require("../templates/invoice/saleInvoice");
const saleReturnInvoiceMailTemplate = require("../templates/email/saleReturnInvoiceMailTemplate");
const saleInvoiceMailTemplate = require("../templates/email/saleInvoiceMailTemplate");
const Company = require("../models/company.model");

const getSales = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;

  let query = { company: req.user.company };
  const user = req.user;
  if(user.role == "employee"){
    query = { signedBy: user.id };
  };

  const sales = await Sale.find(query)
    .populate("signedBy")
    .populate("customer")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalSales = await Sale.countDocuments(query);

  res.json({
    success: true,
    sales,
    totalPages: Math.ceil(totalSales / limit) || 1,
    page,
    totalSales,
  });
};

const getEmployeeSales = async (req, res) => {
  const { limit = 10, page = 1, employeeId = { $exists: true } } = req.query;
  const sales = await Sale.find({ signedBy: employeeId, company: req.user.company })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalSales = await Sale.countDocuments({ signedBy: employeeId, company: req.user.company });
  res.json({
    success: true,
    sales,
    totalPages: Math.ceil(totalSales / limit) || 1,
    page,
    totalSales,
  });
};

const getSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate(
    "products.product customer signedBy"
  );

  if(!sale){
    return res.status(404).json({ success: false, message: "Sale not found." });
  }

  const saleReturn = await SalesReturn.findOne({ saleId: sale._id })
    .populate("customer products.product signedBy")
    .lean();

  const formattedSale = {
    _id: sale._id,
    subTotal: sale.subTotal,
    discount: sale.discount,
    totalAmount: sale.totalAmount,
    createdAt: sale.createdAt,
    paymentMode: sale.paymentMode,
    invoice: sale.invoice,
    products: sale.products.map((item) => ({
      product: item?.product?._id,
      image: item?.product?.image,
      name: item?.product?.name,
      quantity: item?.quantity,
      primaryUnit: item?.product?.primaryUnit,
      secondaryUnit: item?.product?.secondaryUnit,
      expiry: item?.expiry,
      mrp: item?.mrp,
      sellingRate: item?.sellingRate,
      discount: item?.discount,
      price: item?.sellingRate * item?.quantity,
    })),
    customer: sale.customer
      ? {
          name: sale?.customer?.name,
          phone: sale?.customer?.phone,
          email: sale?.customer?.email,
        }
      : null,
    signedBy: sale?.signedBy,
  };

  if (saleReturn) {
    formattedSale.saleReturn = saleReturn;
  }
  res.json({ success: true, sale: formattedSale });
};

const deleteSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) {
    return res.status(404).json({ success: false, message: "Sale not found." });
  }

  // Update Inventory
  for (const product of sale.products) {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    
    if(!inventory){
      await Inventory.create({
        product: product.product,
        totalQuantity: product.quantity,
        batches: [
          {
            quantity: product.quantity,
            mrp: product.mrp,
            sellingRate: product.sellingRate,
            expiry: product.expiry,
          },
        ],
      });
    } else {
      inventory.batches.push({
        quantity: product.quantity,
        mrp: product.mrp,
        sellingRate: product.sellingRate,
        expiry: product.expiry,
      });
      inventory.totalQuantity += product.quantity;
      await inventory.save();
    }
  
  }
  await sale.deleteOne();
  return res.json({ success: true, message: "Sale deleted successfully." });
};

const getSaleReturns = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "desc",
  } = req.query;

  let query = {company: req.user.company}; 
  const user = req.user;
  if(user.role !== "admin"){
    query = { signedBy: user.id };
  };

  const salesReturns = await SalesReturn.find(query)
    .populate("signedBy")
    .populate("customer")
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ [sort]: sortType });

  const totalSalesReturns = await SalesReturn.countDocuments(query);
  res.json({
    success: true,
    salesReturns,
    totalPages: Math.ceil(totalSalesReturns / limit) || 1,
    page,
    totalSalesReturns,
  });
};

const addSale = async (req, res) => {
  const {
    products = [
      {
        product: "",
        quantity: 0,
        sellingRate: 0,
        expiry: "",
      },
    ],
    customerMobile,
    discount = 0,
    subTotal = 0,
    totalAmount = 0,
    paymentMode = "cash",
  } = req.body;

  if (!products.length) {
    return res.status(400).json({ message: "Products are required." });
  }

  const sale = await Sale.create({
    products,
    signedBy: req.user.id,
    company: req.user.company,
    subTotal,
    discount,
    totalAmount,
    paymentMode,
  });

  let customer = null;
  if (customerMobile) {
      customer = await Customer.findOne({ phone: customerMobile, company : req.user.company });
    if (!customer) {
      customer = await Customer.create({ phone: customerMobile, company : req.user.company });
    } 
    sale.customer = customer._id;
  }
  await sale.save();

  // Update Inventory
  for (const product of products) {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");

    for (const batch of inventory?.batches || []) {
      const sameBatch =
        (!batch.expiry ||
          !product.expiry ||
          new Date(batch?.expiry).getTime() ===
            new Date(product?.expiry).getTime()) &&
        batch.sellingRate === product.sellingRate &&
        (!product.mrp || !batch.mrp || batch.mrp === product?.mrp);
      if (sameBatch) {
        batch.quantity -= product.quantity;
        if (batch.quantity === 0) {
          inventory.batches.pull(batch._id);
        }
        inventory.totalQuantity -= product.quantity;
        await inventory.save();
        break;
      }
    }
    
    // Send Mail to Admin if stockPreference set
    if (inventory?.product?.stockAlert?.preference) {
      if (inventory.totalQuantity < inventory?.product?.stockAlert.quantity) {
        const company = await Company.findById(req.user.company).select("email").lean();
        sendMail(
          (to = company.email),
          (subject = "Low Stock Alert"),
          (message = lowStockMailTemplate(
            inventory.product.name,
            inventory.totalQuantity
          ))
        );
      }
    }
  };
  
  sale.invoice = await generateSaleInvoice(sale._id);
  await sale.save();

  //send mail to customer
  if(customer?.email){
    const updatedSale = await Sale.findById(sale._id).populate("customer signedBy products.product" );
    sendMail(
      customer.email,
      "Sales Invoice",
      (message = saleInvoiceMailTemplate(updatedSale))
    )
  }
  res.json({ success: true, sale });
};

const regenerateSaleInvoice = async (req, res) => {
  const sale = await Sale.findById(req.params.id).select("_id invoice");
  if (!sale) {
    return res.status(404).json({ success: false, message: "Sale not found." });
  }
    sale.invoice = await generateSaleInvoice(sale._id);
    await sale.save();
    res.json({ success: true, sale });
};

const addSaleReturn = async (req, res) => {
  const { invoiceId, products = [] } = req.body;
  const sale = await Sale.findById(invoiceId).populate("customer").lean();
  if (!sale) {
    return res.status(404).json({ success:false, message: "Sale not found." });
  }

  // Check if valid products are returned (less than sold quantity)
  for (const product of products) {
    if (
      sale.products.find(
        (item) => item.product.toString() === product.product.toString()
      ).quantity < product.quantity
    ) {
      return res.status(400).json({ error: "Invalid quantity returned." });
    }
  }

  // Check already Existing Sales Return
  const existingReturn = await SalesReturn.findOne({ saleId: invoiceId })
    .select(" saleId ")
    .lean();
  if (existingReturn) {
    return res.status(400).json({ success:false, message: "Return already exists on this bill." });
  }

  // Create a new sale return document
  const saleReturn = await SalesReturn.create({
    reason: req.body.reason,
    saleId: invoiceId,
    customer: sale?.customer?._id,
    products: req.body.products.map((product) => ({
      product: product.product,
      quantity: product.quantity,
      mrp: product.mrp,
      sellingRate: product.sellingRate,
      expiry: product.expiry,
    })),
    signedBy: req.user.id,
    company: req.user.company,
    subTotal: req.body.subTotal,
    discount: req.body.discount,
    totalAmount: req.body.totalAmount,
  });

  // Update Inventory
  products.forEach(async (product) => {
    const inventory = await Inventory.findOne({
      product: product.product,
    }).populate("product");
    if (!inventory) {
      await Inventory.create({
        product: product.product,
        totalQuantity: product.quantity,
        batches: [
          {
            quantity: product.quantity,
            mrp: product.mrp,
            sellingRate: product.sellingRate,
            expiry: product.expiry,
          },
        ],
      });
    }
    inventory.batches.push({
      quantity: product.quantity,
      mrp: product.mrp,
      sellingRate: product.sellingRate,
      expiry: product.expiry,
    });
    inventory.totalQuantity += product.quantity;

    inventory.batches = await mergeBatchesHelper(inventory.batches);
    await inventory.save();
  });

  const populatedSaleReturn = await SalesReturn.findById(saleReturn._id).populate(
    "customer products.product"
  );

  // Generate a sales return invoice
  saleReturn.invoice = await generateSalesReturnInvoice({
    _id: populatedSaleReturn._id,
    returnDate: populatedSaleReturn.createdAt,
    customer: populatedSaleReturn?.customer,
    products : populatedSaleReturn?.products,
    subTotal: populatedSaleReturn?.subTotal,
    discount: populatedSaleReturn?.discount,
    totalAmount: populatedSaleReturn?.totalAmount,
    reason: populatedSaleReturn?.reason,
  });

  await saleReturn.save();


  // Send the invoice to the customer
  if (populatedSaleReturn?.customer?.email) {
    sendMail(
      populatedSaleReturn?.customer?.email,
      "Sales Return Invoice",
      (message = saleReturnInvoiceMailTemplate(populatedSaleReturn))
    );
  }

  res.json({ success: true, populatedSaleReturn });
};

const getRecentSale = async (req, res) => {
  // Find the most recent sale by sorting by date descending
  const recentSale = await Sale.findOne({company: req.user.company})
    .sort({ createdAt: -1 })
    .populate("products.product")
    .populate("customer")
    .populate("signedBy");

  if (!recentSale) {
    return res.status(404).json({ error: "No recent sales found." });
  }

  // Format the recent sale data to include all the relevant details
  const recentSaleDetails = {
    saleId: recentSale._id,
    date: recentSale.createdAt,
    totalAmount: recentSale.totalAmount,
    products: recentSale.products.map((item) => ({
      productName: item?.product?.name,
      quantity: item?.quantity,
      primaryUnit: item?.product?.primaryUnit,
      secondaryUnit: item?.product?.secondaryUnit,
      rate: item?.sellingRate,
      totalPrice: item?.quantity * item?.sellingRate,
    })),
    customer: recentSale.customer
      ? {
          name: recentSale?.customer?.name,
          phone: recentSale?.customer?.phone,
          email: recentSale?.customer?.email,
        }
      : null,
    signedBy: recentSale?.signedBy
      ? {
          name: recentSale.signedBy.name,
          email: recentSale.signedBy.email,
          phone: recentSale.signedBy.phone,
        }
      : null,
  };

  res.json({ recentSale: recentSaleDetails });
};

module.exports = {
  getSales,
  getEmployeeSales,
  getSale,
  deleteSale,
  getSaleReturns,
  addSale,
  regenerateSaleInvoice,
  addSaleReturn,
  getRecentSale,
};
