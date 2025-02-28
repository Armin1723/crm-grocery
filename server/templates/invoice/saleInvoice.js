const Sale = require("../../models/sale.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const cloudinary = require("../../config/cloudinary");

// Helper function to split text into multiple lines based on max line length
const splitTextToLines = (text, maxLength) => {
  const lines = [];
  let currentLine = "";

  text.split(" ").forEach((word) => {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const formatCurrency = (value) => {
  const rupeeSymbol = "₹";
  return `${rupeeSymbol}${value.toFixed(2)}`;
};
const formatDate = (date) => new Date(date).toLocaleString("en-IN");

const generateSaleInvoice = async (saleId) => {
  try {
    const sale = await Sale.findById(saleId)
      .populate("products.product")
      .populate("customer")
      .populate("signedBy")
      .populate("company");

    if (!sale) throw new Error("Sale not found");

    const doc = new PDFDocument({
      size: [216, 400],
      margin: 10,
    });

    const filePath = `./tmp/sale_receipt_${sale._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Set monospaced font for alignment
    doc.y = 10;
    doc.font("Courier");

    // Add Header
    addHeader(doc, sale);

    // Add Customer Details
    addCustomerDetails(doc, sale.customer);

    // Add Product Details
    addProductTable(doc, sale.products);

    // Add Invoice Summary
    addInvoiceSummary(doc, sale);

    // Add Footer
    addFooter(doc, sale?.discount, sale);

    doc.end();

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `${sale?.company?.licenseKey}/invoices/sales`,
      resource_type: "raw",
    });

    fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("Error generating sale receipt:", error);
    throw error;
  }
};

const addHeader = (doc, sale) => {
  doc
    .fontSize(10)
    .text(sale?.company?.name?.toUpperCase(), { align: "center", bold: true })
    .moveDown(0.2)
    .fontSize(8)
    .text(sale?.company?.address, { align: "center" })
    .text(`Phone: ${sale?.company?.phone}`, { align: "center" })
    .text(`Email: ${sale?.company?.email  || 'N/A'}`, { align: "center" })
    .moveDown(0.2)
    .text("------------------------------------------------", { align: "center" })
    .moveDown(0.5)
    .text("SALE RECEIPT", { align: "center", underline: true })
    .moveDown(0.5)
    .text(`Receipt No: ${sale._id}`, { align: "center" })
    .text(`Date: ${formatDate(new Date())}`, { align: "center" })
    .moveDown();
};

const addCustomerDetails = (doc, customer) => {
  doc
    .fontSize(8)
    .text("Customer Details:", { underline: true })
    .text(`Name   : ${customer?.name || "N/A"}`)
    .text(`Contact: ${customer?.phone || "N/A"}`)
    .text(`Balance: ${customer?.balance || 0}`)
    .moveDown();
};

const addProductTable = (doc, products) => {
  const lineHeight = 12; // Adjust this value to control the space between lines
  const maxProductNameLength = 15; // Maximum length for product names before wrapping

  doc
    .fontSize(8)
    .text("Items:", { underline: true })
    .moveDown(0.2)
    .text("------------------------------------------------", { align: "center" })
    .text("S.No  Product        Qty   Rate    Total", { align: "left" })
    .text("------------------------------------------------", { align: "center" })
    .moveDown(0.2);

  products.forEach((item, index) => {
    const productName = item.product?.name || "Unknown";
    const quantity = item.quantity || 0;
    const price = item.sellingRate || 0;
    const total = quantity * price;
    const mrp = item.mrp;

    // Split product name into multiple lines if it exceeds the maximum length
    const productNameLines = splitTextToLines(productName, maxProductNameLength);

    // Render the first line with all details
    doc.text(
      `${(index + 1).toString().padEnd(5)}${productNameLines[0].padEnd(15)}${quantity.toString().padStart(3)}${formatCurrency(price).padStart(8)}${formatCurrency(total).padStart(7)}`,
      { align: "left" }
    );

    // Render subsequent lines with only the product name
    for (let i = 1; i < productNameLines.length; i++) {
      doc.text(
        `${" ".padEnd(5)}${productNameLines[i].padEnd(15)}${" ".padEnd(3)}${" ".padEnd(8)}${" ".padEnd(7)}`,
        { align: "left" }
      );
      doc.moveDown(lineHeight / 72); // Convert lineHeight from points to inches
    }

    // Render Product Mrp
    if(mrp){
      doc.text(
        `${" ".padEnd(5)}${`MRP: ${item?.mrp}`.padEnd(15)}${" ".padEnd(3)}${" ".padEnd(8)}${" ".padEnd(7)}`,
        { align: "left" }
      );
      doc.moveDown(lineHeight / 72); // Convert lineHeight from points to inches
    }
    
    doc.moveDown(0.2);
  });

  doc
    .text("------------------------------------------------", { align: "center" })
    .moveDown(1);
};

const addInvoiceSummary = (doc, sale) => {
  doc
    .fontSize(8)
    .text("Summary:", { underline: true })
    .moveDown(0.2)
    .text(
      `Total Items   :  ${sale.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}`
    )
    .text(`Sub Total     : ${formatCurrency(sale.subTotal || 0)}`)
    .text(`Discount      : ${formatCurrency(sale.discount || 0)}`)
    .text(`Total Amount  : ${formatCurrency(sale.totalAmount || 0)}`, {
      bold: true,
    })
    .moveDown(1);
};

const addFooter = (doc, discount = 0, sale) => {
  doc
    .fontSize(8)
    .text("------------------------------------------------", {
      align: "center",
    })
    .moveDown(0.2)
    .text(`You saved ₹${discount.toFixed(2)} on this purchase.`, {
      align: "center",
      bold: true,
      italic: true,
    })
    .moveDown(0.5)
    .text("Thank you for shopping with us!", { align: "center" })
    .moveDown(0.5)
    .text("This is a computer-generated receipt.", { align: "center" })
    .text(`Generated on ${sale.createdAt}`, {
      align: "center",
    });
};

module.exports = generateSaleInvoice;