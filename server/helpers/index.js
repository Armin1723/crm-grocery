require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");
const Sale = require("../models/sale.model");

// Common utility functions for invoice generation
const createHeaderSection = (doc, title) => {
  doc
    // .image('./assets/logo.png', 50, 45, { width: 100 })  
    .fontSize(24)
    .text("FRESH MART GROCERY", { align: "center" })
    .fontSize(12)
    .text("Your One-Stop Grocery Solution", { align: "center" })
    .text("123 Retail Avenue, Shopping District", { align: "center" })
    .text("Tel: (555) 123-4567 | Email: sales@freshmart.com", { align: "center" })
    .text("GST No: XXXXXXXXXXXX", { align: "center" })
    .moveDown(1)
    .fontSize(20)
    .text(title, { align: "center" })
    .moveTo(50, doc.y + 10)
    .lineTo(550, doc.y + 10)
    .stroke();
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

const createTableHeader = (doc, headers) => {
  doc.fontSize(10);
  const startY = doc.y + 20;
  
  // Draw table header background
  doc
    .fillColor('#f0f0f0')
    .rect(50, startY - 5, 500, 20)
    .fill()
    .fillColor('#000');

  // Add headers
  headers.forEach((header, i) => {
    doc.text(header.label, header.x, startY, { width: header.width });
  });

  doc.moveDown();
};

const generatePurchaseInvoice = async (purchaseId) => {
  try {
    const purchase = await Purchase.findById(purchaseId)
      .populate("products.product")
      .populate("supplier")
      .populate("signedBy");

    const doc = new PDFDocument({
      size: [216, 400], // 72mm width, dynamic height
      margin: 10, 
    });

    const filePath = `./tmp/purchase_receipt_${purchase._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(12)
      .text("PURCHASE RECEIPT", { align: "center", underline: true })
      .moveDown(0.5);

    doc
      .fontSize(8)
      .text(`Receipt No: ${purchase._id}`, { align: "center" })
      .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, { align: "center" })
      .moveDown();

    // Supplier Details
    doc
      .fontSize(8)
      .text("Supplier Details:")
      .text(`Name: ${purchase.supplier?.name || "N/A"}`)
      .text(`Contact: ${purchase.supplier?.phone || "N/A"}`)
      .moveDown();

    // Products Table
    doc.fontSize(8).text("Items:", { underline: true });
    doc
      .text("S.No  Product          Qty   Rate    Total", { align: "left" })
      .moveDown(0.5);

    let totalItems = 0;
    purchase.products.forEach((item, index) => {
      const productName = item.product?.name || "Unknown";
      const quantity = item.quantity || 0;
      const price = item.purchaseRate || 0;
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
    doc.text(`Sub Total: ${formatCurrency(purchase.products.reduce((sum, item) => sum + item.quantity * item.purchaseRate, 0))}`);
    doc.text(`Other Charges: ${formatCurrency(purchase.otherCharges || 0)}`);
    doc.text(`Total Amount: ${formatCurrency(purchase.products.reduce((sum, item) => sum + item.quantity * item.purchaseRate, 0) + (purchase.otherCharges || 0))}`, { bold: true });
    doc.moveDown(1);

    // Footer
    doc
      .fontSize(8)
      .text("Thank you for your business!", { align: "center" })
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
    console.error("Error generating purchase receipt:", error);
    throw error;
  }
};


const generateSaleInvoice = async (saleId) => {
  try {
    const sale = await Sale.findById(saleId)
      .populate("products.product")
      .populate("customer")
      .populate("signedBy");

    const doc = new PDFDocument({
      size: [216, 400], // 72mm width, dynamic height
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
