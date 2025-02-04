require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../../config/cloudinary");
const path = require("path");
const PurchaseReturn = require("../../models/purchaseReturn.model");

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

const generatePurchaseReturnInvoice = async (purchaseReturnId) => {
  try {
    const purchaseReturn = await PurchaseReturn.findById(purchaseReturnId)
      .populate("products.product")
      .populate("supplier")
      .populate("signedBy")
      .populate("company");

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const filePath = `./tmp/purchase_return_receipt_${purchaseReturn._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    await generateHeader(doc, purchaseReturn);

    // Supplier Details
    generateSupplierInformation(doc, purchaseReturn);

    // Products Table
    generateInvoiceTable(doc, purchaseReturn);

    // Summary
    generateSummary(doc, purchaseReturn);

    // Footer
    generateFooter(doc, purchaseReturn);

    doc.end();

    // Wait for the file to be written and then upload to Cloudinary
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `${purchaseReturn?.company?.licenseKey}/invoices/purchaseReturn`,
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error generating purchase return receipt:", error);
    throw error;
  }
};

async function generateHeader(doc, purchaseReturn) {
  // Main Title
  try {
    doc
      .fillColor("#444444")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Purchase Return Invoice", { align: "center", bold: true })
      .moveDown(1);

    if (!purchaseReturn?.company?.logo) {
      throw new Error("Company logo URL is missing");
    }

    // Fetch the Cloudinary image as a buffer
    const response = await fetch(purchaseReturn.company.logo);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Logo and Title
    doc
      .font("Helvetica")
      .image(imageBuffer, 50, 85, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text(purchaseReturn.company.name, 110, 97);

    // Invoice ID
    doc.fontSize(10).text("Invoice Id: " + purchaseReturn._id, 110, 122);

    // Address Section
    doc
      .fontSize(10)
      .text(purchaseReturn?.company?.name, 200, 90, { align: "right" })
      .text(
        purchaseReturn?.company?.address?.split(" ")?.slice(0, 4).join(" "),
        200,
        105,
        { align: "right" })
      .text(
          `Email: ${purchaseReturn?.company?.email}`,
          200,
          120,
          { align: "right" }
        )
      .moveDown();
  } catch (err) {
    console.log(err);
  }
}

function generateSupplierInformation(doc, purchaseReturn) {
  doc.fillColor("#444444").fontSize(12).text("Supplier Details", 50, 160);

  generateHr(doc, 185);

  const supplierInformationTop = 200;
  doc
    .fontSize(10)
    .text("Supplier Name:", 50, supplierInformationTop)
    .font("Helvetica-Bold")
    .text(purchaseReturn.supplier?.name || "N/A", 150, supplierInformationTop)
    .font("Helvetica")
    .text("Contact:", 50, supplierInformationTop + 15)
    .text(
      purchaseReturn.supplier?.phone || "N/A",
      150,
      supplierInformationTop + 15
    )
    .text("Email:", 50, supplierInformationTop + 30)
    .text(
      purchaseReturn.supplier?.email || "N/A",
      150,
      supplierInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, purchaseReturn) {
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

  purchaseReturn.products.forEach((item, index) => {
    const productName = item.product?.name || "Unknown";
    const quantity = `${item?.quantity || 0} ${item?.product?.secondaryUnit}`;
    const price = item?.purchaseRate || 0;
    const total = (item?.quantity || 0) * price;

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

function generateSummary(doc, purchaseReturn) {
  const invoiceTableTop = 330 + (purchaseReturn.products.length + 1) * 30; // Adjusted for proper positioning

  const subtotalPosition = invoiceTableTop + 20;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "Subtotal",
    formatCurrency(purchaseReturn.subTotal)
  );

  const otherChargesPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    otherChargesPosition,
    "",
    "",
    "",
    "Other Charges",
    formatCurrency(purchaseReturn?.otherCharges || 0)
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
    formatCurrency(purchaseReturn?.totalAmount || 0)
  );
}

function generateTableRow(doc, y, item, description, quantity, rate, total) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 100, y)
    .text(quantity, 320, y, { width: 90, align: "right" })
    .text(rate, 390, y, { width: 90, align: "right" })
    .text(total, 480, y, { width: 90, align: "right" });
}

function generateFooter(doc, purchaseReturn) {
  doc
    .fontSize(8)
    .text("Thank you for your business!", 50, 750, { align: "center" })
    .moveDown(0.5)
    .text("This is a computer-generated receipt.", { align: "center" })
    .text(`Generated on ${formatDate(purchaseReturn.createdAt)}`, {
      align: "center",
    });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(20, y).lineTo(580, y).stroke();
}

module.exports = generatePurchaseReturnInvoice;
