require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const Purchase = require("../models/purchase.model");
const path = require("path");
const nodemailer = require("nodemailer");

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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
    .image(path.join(__dirname, "logo.png"), 50, 45, { width: 50 })
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
  doc.fillColor("#444444").fontSize(12).text("Supplier Details", 50, 160);

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
    const quantity = (item?.quantity / item?.product?.conversionFactor) || 0;
    const price = item?.purchaseRate * item?.product?.conversionFactor || 0;
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
    "",
    "Subtotal",
    formatCurrency(purchase.subTotal)
  );

  const otherChargesPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    otherChargesPosition,
    "",
    "",
    "",
    "Other Charges",
    formatCurrency(purchase?.otherCharges || 0)
  );

  const totalAmountPosition = otherChargesPosition + 20;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    totalAmountPosition,
    "",
    "",
    "",
    "Total Amount",
    formatCurrency(purchase?.totalAmount || 0)
  );

  const paidToDatePosition = totalAmountPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "",
    "Paid To Date",
    formatCurrency(purchase?.paidAmount)
  );

  const duePosition = paidToDatePosition + 20;
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "",
    "Balance Due",
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
    .text(description, 100, y)
    .text(quantity, 320, y, { width: 90, align: "right" })
    .text(rate, 390, y, { width: 90, align: "right" })
    .text(total, 480, y, { width: 90, align: "right" });
}

function generateFooter(doc) {
  doc
    .fontSize(8)
    .text("Thank you for your business!", 50, 750, { align: "center" })
    .moveDown(0.5)
    .text("This is a computer-generated receipt.", { align: "center" })
    .text(`Generated on ${new Date().toLocaleString("en-IN")}`, {
      align: "center",
    });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(20, y).lineTo(580, y).stroke();
}

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

const mergeBatchesHelper = async (batches) => {
  if (batches.length < 2) return batches;

  // Merge batches with same MRP, sellingRate, and compatible expiry
  const mergedBatches = [];
  const visited = new Set();

  for (let i = 0; i < batches.length; i++) {
    if (visited.has(i)) continue;

    const batch1 = batches[i];
    let mergedBatch = { ...batch1, quantity: Number(batch1.quantity) || 0 };
    visited.add(i);

    for (let j = i + 1; j < batches.length; j++) {
      if (visited.has(j)) continue;

      const batch2 = batches[j];

      // Check if MRP, sellingRate match, and expiry is compatible
      const canMerge =
        (!batch1.mrp || !batch2.mrp || batch1.mrp == batch2.mrp) &&
        batch1.sellingRate == batch2.sellingRate &&
        (!batch1.expiry ||
          !batch2.expiry ||
          batch1.expiry.getTime() == batch2.expiry.getTime());

      if (canMerge) {
        // Merge quantities and mark batch as visited
        mergedBatch.quantity += Number(batch2?.quantity) || 0;
        mergedBatch.expiry = mergedBatch.expiry || batch2.expiry;
        visited.add(j);
      }
    }

    mergedBatches.push(mergedBatch);
  }

  return mergedBatches;
};

module.exports = { sendMail, mergeBatchesHelper, generatePurchaseInvoice };
