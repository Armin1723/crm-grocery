const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
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

const formatCurrency = (value) => `₹${value.toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

const generateSalesReturnInvoice = async (salesReturn) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument({
      size: [216, 400], // 3-inch width, variable height
      margin: 10,
    });

    const filePath = `./tmp/sales_return_invoice_${salesReturn._id}.pdf`;
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Set monospaced font for alignment
    doc.font("Courier");

    // Add Header
    addHeader(doc, salesReturn);

    // Add Customer Details
    addCustomerDetails(doc, salesReturn.customer);

    // Add Product Table
    addProductTable(doc, salesReturn.products);

    // Add Invoice Summary
    addInvoiceSummary(doc, salesReturn);

    // Add Reason for Return
    addReasonForReturn(doc, salesReturn.reason);

    // Add Footer
    addFooter(doc);

    doc.end();

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
    console.error("Error generating sales return invoice:", error);
    throw error;
  }
};

const addHeader = (doc, salesReturn) => {
  doc
    .fontSize(10)
    .text("YOUR STORE NAME", { align: "center", bold: true })
    .moveDown(0.2)
    .fontSize(8)
    .text("123 Market Street", { align: "center" })
    .text("City, State, ZIP", { align: "center" })
    .text("Phone: (123) 456-7890", { align: "center" })
    .moveDown(0.5)
    .text("SALES RETURN INVOICE", { align: "center", underline: true })
    .moveDown(0.5)
    .text(`Return ID: ${salesReturn._id}`, { align: "center" })
    .text(`Date: ${formatDate(salesReturn.createdAt)}`, { align: "center" })
    .moveDown();
};

const addCustomerDetails = (doc, customer) => {
  doc
    .fontSize(8)
    .text("Customer Details:", { underline: true })
    .text(`Name   : ${customer?.name || "N/A"}`)
    .text(`Contact: ${customer?.phone || "N/A"}`)
    .moveDown();
};

const addProductTable = (doc, products) => {
  const lineHeight = 12;
  const maxProductNameLength = 15;

  doc
    .fontSize(8)
    .text("Items:", { underline: true })
    .moveDown(0.2)
    .text("------------------------------------------------", {
      align: "center",
    })
    .text("S.No  Product        Qty   Rate    Total", { align: "left" })
    .text("------------------------------------------------", {
      align: "center",
    })
    .moveDown(0.2);

  products.forEach((item, index) => {
    const productName = item.product?.name || "Unknown";
    const quantity = item.quantity || 0;
    const price = item.sellingRate || 0;
    const total = quantity * price;

    // Split product name into multiple lines if it exceeds the maximum length
    const productNameLines = splitTextToLines(
      productName,
      maxProductNameLength
    );

    // Render the first line with all details
    doc.text(
      `${(index + 1).toString().padEnd(5)}${productNameLines[0].padEnd(
        15
      )}${quantity.toString().padStart(3)}${formatCurrency(price).padStart(
        8
      )}${formatCurrency(total).padStart(7)}`,
      { align: "left" }
    );

    // Render subsequent lines with only the product name
    for (let i = 1; i < productNameLines.length; i++) {
      doc.text(
        `${" ".padEnd(5)}${productNameLines[i].padEnd(15)}${" ".padEnd(
          3
        )}${" ".padEnd(8)}${" ".padEnd(7)}`,
        { align: "left" }
      );
      doc.moveDown(lineHeight / 72); // Convert lineHeight from points to inches
    }

    doc.moveDown(0.2);
  });

  doc
    .text("------------------------------------------------", {
      align: "center",
    })
    .moveDown(1);
};

const addInvoiceSummary = (doc, salesReturn) => {
  doc
    .fontSize(8)
    .text("Summary:", { underline: true })
    .moveDown(0.2)
    .text(
      `Total Items   :  ${salesReturn.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}`
    )
    .text(`Sub Total     : ${formatCurrency(salesReturn.subTotal || 0)}`)
    .text(`Other Charges : ${formatCurrency(salesReturn.otherCharges || 0)}`)
    .text(`Discount      : ${formatCurrency(salesReturn.discount || 0)}`)
    .text(`Amount        : ${formatCurrency(salesReturn.totalAmount || 0)}`, {
      bold: true,
    })
    .moveDown(1);
};

const addReasonForReturn = (doc, reason) => {
  doc
    .fontSize(8)
    .text("Reason for Return:", { underline: true })
    .text(reason || "N/A")
    .moveDown();
};

const addFooter = (doc) => {
  doc
    .fontSize(8)
    .text("------------------------------------------------", {
      align: "center",
    })
    .moveDown(0.2)
    .text("Thank you for your cooperation!", { align: "center" })
    .moveDown(0.5)
    .text("This is a computer-generated invoice.", { align: "center" })
    .text(`Generated on ${new Date().toLocaleString("en-IN")}`, {
      align: "center",
    });
};

module.exports = generateSalesReturnInvoice;