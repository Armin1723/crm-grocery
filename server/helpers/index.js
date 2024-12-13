require("dotenv").config();
const nodemailer = require("nodemailer");

const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");
const Sale = require("../models/sale.model");

const generatePurchaseInvoice = async (purchaseId) => {
  try {
    const purchase = await Purchase.findById(purchaseId)
      .populate("products.product")
      .populate("supplier")
      .populate("signedBy");
    const doc = new PDFDocument({ margin: 50 }); // Added margins

    const filePath = `./tmp/invoice_${purchase._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // **Header Section**
    doc
      .fontSize(20)
      .text("ABC Company", { align: "center" })
      .fontSize(12)
      .text("Address: 1234 Business St, City, Country", { align: "center" })
      .text("Phone: +1234567890 | Email: support@yourcompany.com", {
        align: "center",
      })
      .moveDown(1)
      .fontSize(18)
      .text("Purchase Invoice", { align: "center", underline: true });

    // **Invoice Details**
    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Invoice ID: ${purchase._id}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .text(`Supplier: ${purchase.supplier?.name || "Unknown"}`)
      .text(`Signed By: ${purchase.signedBy?.name || "Unknown"}`);

    doc.moveDown();

    // **Table Header**
    doc.fontSize(14).text("Products", { underline: true }).moveDown(0.5);

    doc
      .fontSize(12)
      .text(
        "S.No    Product Name                        Qty       Rate       Tax         Total",
        { underline: true }
      )
      .moveDown(0.5);

    // **Table Body**
    purchase.products.forEach((item, index) => {
      const productName = item.product.name || "Unknown";
      const quantity = item.quantity || 0;
      const purchaseRate = item.purchaseRate || 0;
      const tax = (item.quantity * item.purchaseRate * item.tax) / 100 || 0;
      const total = quantity * purchaseRate + tax;

      doc
        .text(
          `${index + 1}        ${productName.padEnd(
            30
          )}       ${quantity}        ${purchaseRate.toFixed(
            2
          )}        ${tax.toFixed(2)}        ${total.toFixed(2)}`,
          { align: "left" }
        )
        .moveDown(0.5);
    });

    // **Footer Totals**
    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Subtotal: ${purchase.subTotal.toFixed(2)}`, { align: "right" })
      .text(`Other Charges: ${purchase.otherCharges?.toFixed(2) || "0.00"}`, {
        align: "right",
      })
      .text(`Discount: ${purchase.discount?.toFixed(2) || "0.00"}`, {
        align: "right",
      })
      .text(`Total Amount: ${purchase.totalAmount.toFixed(2)}`, {
        align: "right",
        underline: true,
      });

    // **Footer Section**
    doc
      .moveDown(2)
      .fontSize(10)
      .text(
        "Thank you for your business! Please contact us if you have any questions.",
        { align: "center" }
      );

    // End and save the document
    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "crm-grocery/invoices",
      resource_type: "raw",
    });

    const invoiceUrl = uploadResult.secure_url;

    // Delete the file locally
    fs.unlinkSync(filePath);

    return invoiceUrl;
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw error;
  }
};

const generateSaleInvoice = async (saleId) => {
  try {
    const sale = await Sale.findById(saleId)
      .populate("products.product")
      .populate("customer")
      .populate("signedBy");
    const doc = new PDFDocument({ margin: 50 }); // Added margins

    const filePath = `./tmp/invoice_${sale._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // **Header Section**
    doc
      .fontSize(20)
      .text("ABC Company", { align: "center" })
      .fontSize(12)
      .text("Address: 1234 Business St, City, Country", { align: "center" })
      .text("Phone: +1234567890 | Email: support@yourcompany.com", {
        align: "center",
      })
      .moveDown(1)
      .fontSize(18)
      .text("Sales Invoice", { align: "center", underline: true });

    // **Invoice Details**
    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Invoice ID: ${sale._id}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .text(`Supplier: ${sale.customer?.name || "Customer"}`)
      .text(`Signed By: ${sale.signedBy?.name || "Unknown"}`);

    doc.moveDown();

    // **Table Header**
    doc.fontSize(14).text("Products", { underline: true }).moveDown(0.5);

    doc
      .fontSize(12)
      .text(
        "S.No    Product Name                        Qty       Rate       Tax         Total",
        { underline: true }
      )
      .moveDown(0.5);

    // **Table Body**
    sale.products.forEach((item, index) => {
      const productName = item.product.name || "Unknown";
      const quantity = item.quantity || 0;
      const sellingRate = item.sellingRate || 0;
      const tax = (item.quantity * item.sellingRate * item.tax) / 100 || 0;
      const total = quantity * sellingRate + tax;

      doc
        .text(
          `${index + 1}        ${productName.padEnd(
            30
          )}       ${quantity}        ${sellingRate.toFixed(
            2
          )}        ${tax.toFixed(2)}        ${total.toFixed(2)}`,
          { align: "left" }
        )
        .moveDown(0.5);
    });

    // **Footer Totals**
    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Subtotal: ${sale.subTotal.toFixed(2)}`, { align: "right" })
      .text(`Other Charges: ${sale.otherCharges?.toFixed(2) || "0.00"}`, {
        align: "right",
      })
      .text(`Discount: ${sale.discount?.toFixed(2) || "0.00"}`, {
        align: "right",
      })
      .text(`Total Amount: ${sale.totalAmount.toFixed(2)}`, {
        align: "right",
        underline: true,
      });

    // **Footer Section**
    doc
      .moveDown(2)
      .fontSize(10)
      .text(
        "Thank you for your business! Please contact us if you have any questions.",
        { align: "center" }
      );

    // End and save the document
    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "crm-grocery/invoices",
      resource_type: "raw",
    });

    const invoiceUrl = uploadResult.secure_url;

    // Delete the file locally
    fs.unlinkSync(filePath);

    return invoiceUrl;
  } catch (error) {
    console.error("Error generating invoice:", error);
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
