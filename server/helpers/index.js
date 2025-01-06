require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");
const Sale = require("../models/sale.model");
const path = require("path");
const nodemailer = require("nodemailer");

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const generatePurchaseInvoice = async (purchaseId) => {
  try {
    const purchase = await Purchase.findById(purchaseId)
      .populate("products.product")
      .populate("supplier")
      .populate("signedBy");

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filePath = `./tmp/purchase_receipt_${purchase._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    generateHeader(doc);

    // Supplier Details
    generateSupplierInformation(doc, purchase);

    // Products Table
    generateInvoiceTable(doc, purchase);

    // Summary
    generateSummary(doc, purchase);

    // Footer
    generateFooter(doc);

    doc.end();

    // Wait for the file to be written and then upload to Cloudinary
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "grocery-crm/invoices",
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error generating purchase receipt:", error);
    throw error;
  }
};

function generateHeader(doc) {
  doc
    .image(path.join(__dirname, 'logo.png'), 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Grocery CRM", 110, 57)
    .fontSize(10)
    .text("Grocery CRM", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
}

function generateSupplierInformation(doc, purchase) {
  doc
    .fillColor("#444444")
    .fontSize(12)
    .text("Supplier Details", 50, 160);

  generateHr(doc, 185);

  const supplierInformationTop = 200;
  doc
    .fontSize(10)
    .text("Supplier Name:", 50, supplierInformationTop)
    .font("Helvetica-Bold") 
    .text(purchase.supplier?.name || "N/A", 150, supplierInformationTop)
    .font("Helvetica")
    .text("Contact:", 50, supplierInformationTop + 15)
    .text(purchase.supplier?.phone || "N/A", 150, supplierInformationTop + 15)
    .text("Email:", 50, supplierInformationTop + 30)
    .text(purchase.supplier?.email || "N/A", 150, supplierInformationTop + 30)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, purchase) {
  const invoiceTableTop = 330;

  doc.font("Helvetica");
  generateTableRow(
    doc,
    invoiceTableTop,
    "S.No",
    "Product",
    "Quantity",
    "Rate",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  purchase.products.forEach((item, index) => {
    const productName = item.product?.name || "Unknown";
    const quantity = item.quantity || 0;
    const price = item.purchaseRate || 0;
    const total = quantity * price;

    const position = invoiceTableTop + (index + 1) * 30;
    generateTableRow(
      doc,
      position,
      index + 1,
      productName,
      quantity,
      formatCurrency(price),
      formatCurrency(total)
    );

    generateHr(doc, position + 20);
  });
}

function generateSummary(doc, purchase) {
  const invoiceTableTop = 330 + (purchase.products.length + 1) * 30; // Adjusted for proper positioning

  const subtotalPosition = invoiceTableTop + 20;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(purchase.subTotal)
  );

  const otherChargesPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    otherChargesPosition,
    "",
    "",
    "Other Charges",  
    "",
    formatCurrency(purchase?.otherCharges || 0)
  );

  const totalAmountPosition = otherChargesPosition + 20;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalAmountPosition,
    "",
    "",
    "Total Amount",   
    "",
    formatCurrency(purchase?.totalAmount || 0)
  );

  const paidToDatePosition = totalAmountPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(purchase?.paidAmount)
  );

  const duePosition = paidToDatePosition + 20;
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(purchase?.deficitAmount || 0)
  );
  doc.font("Helvetica");
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  quantity,
  rate,
  total
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(quantity, 300, y, { width: 90, align: "right" })
    .text(rate, 390, y, { width: 90, align: "right" })
    .text(total, 480, y, { width: 90, align: "right" });
}

function generateFooter(doc) {
  doc
    .fontSize(8)
    .text("Thank you for your business!", 50, 750, { align: "center" })
    .moveDown(0.5)
    .text("This is a computer-generated receipt.", { align: "center" })
    .text(`Generated on ${new Date().toLocaleString("en-IN")}`, { align: "center" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}


const generateSaleInvoice = async (saleId) => {
  try {
    const sale = await Sale.findById(saleId)
      .populate("products.product")
      .populate("customer")
      .populate("signedBy");

    const doc = new PDFDocument({
      size: [216, 400], 
      margin: 10, 
    });

    const filePath = `./tmp/sale_receipt_${sale._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(12)
      .text("SALE RECEIPT", { align: "center", underline: true })
      .moveDown(0.5);

    doc
      .fontSize(8)
      .text(`Receipt No: ${sale._id}`, { align: "center" })
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, { align: "center" })
      .moveDown();

    // Customer Details
    doc
      .fontSize(8)
      .text("Customer Details:")
      .text(`Name: ${sale.customer?.name || "N/A"}`)
      .text(`Contact: ${sale.customer?.phone || "N/A"}`)
      .moveDown();

    // Products Table
    doc.fontSize(8).text("Items:", { underline: true });
    doc
      .text("S.No  Product          Qty   Rate    Total", { align: "left" })
      .moveDown(0.5);

    let totalItems = 0;
    sale.products.forEach((item, index) => {
      const productName = item.product?.name || "Unknown";
      const quantity = item.quantity || 0;
      const price = item.sellingRate || 0;
      const total = quantity * price;

      doc
        .text(
          `${index + 1}. ${productName.substring(0, 10)}   ${quantity}    ${formatCurrency(price)}   ${formatCurrency(
            total
          )}`,
          { align: "left" }
        );

      totalItems += quantity;
    });

    doc.moveDown(1);

    // Invoice Summary
    doc.fontSize(8).text("Summary:", { underline: true });
    doc.text(`Total Items: ${totalItems}`);
    doc.text(`Sub Total: ${formatCurrency(sale.subTotal)}`);
    doc.text(`Other Charges: ${formatCurrency(sale.otherCharges || 0)}`);
    doc.text(`Discount: ${formatCurrency(sale.discount || 0)}`);
    doc.text(`Total Amount: ${formatCurrency(sale.totalAmount)}`, { bold: true });
    doc.moveDown(1);

    // Footer
    doc
      .fontSize(8)
      .text("Thank you for shopping with us!", { align: "center" })
      .moveDown(0.5)
      .text("This is a computer-generated receipt.", { align: "center" })
      .text(`Generated on ${new Date().toLocaleString("en-IN")}`, { align: "center" });

    doc.end();

    // Upload to Cloudinary
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "grocery-crm/invoices",
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error generating sale receipt:", error);
    throw error;
  }
};

const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to,
      subject: subject,
      html: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent -", info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendMail, generatePurchaseInvoice, generateSaleInvoice };
