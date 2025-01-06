const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../../config/cloudinary");

const generateSalesReturnInvoice = async (salesReturn) => {
  try {
    // Create a new document
    const doc = new PDFDocument({
      size: [216, 400], // 3-inch width, variable height
      margin: 10,
    });

    const filePath = path.join(__dirname, "sales_return_invoice.pdf");
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Add Logo
    const logoPath = path.join(__dirname, "../../helpers/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { fit: [80, 80], align: "center" }).moveDown(0.5);
    }
    doc.moveDown(4.5);
    doc
      .font("Helvetica-Bold")
      .text("Grocery Store", { align: "center" })
      .moveDown(0.5);

    // Header
    doc
      .font("Helvetica")
      .fontSize(12)
      .text("SALES RETURN INVOICE", { align: "center", underline: true })
      .moveDown(0.5);

    doc
      .fontSize(8)
      .text(`Return ID: ${salesReturn._id}`, { align: "center" })
      .text(`Date: ${salesReturn.returnDate.toLocaleDateString("en-IN")}`, {
        align: "center",
      })
      .moveDown();

    // Customer Details
    doc
      .fontSize(8)
      .text("Customer Details:", { underline: true })
      .text(`Name: ${salesReturn.customer?.name}`)
      .text(`Contact: ${salesReturn.customer?.phone}`)
      .moveDown(0.5);

    // Products Table Header
    doc
      .fontSize(8)
      .text("Items Returned:", { underline: true })
      .moveDown(0.5)
      .text(`S.No  ${"Product Name".padEnd(10)}          Qty   Price   Total`, {
        align: "left",
      })
      .moveDown(0.5);

    // Products Table Data
    salesReturn.products.forEach((item, index) => {
      const total = item.quantity * item.price;
      doc.text(
        `${index + 1}.     ${item.name.substring(0, 15).padEnd(10)}          ${
          item.quantity
        }    ${item.price}   ${total}`,
        { align: "left" }
      );
    });

    doc.moveDown(1);

    // Invoice Summary
    doc.fontSize(8).text("Summary:", { underline: true });
    doc.text(`Sub Total: ${salesReturn?.subTotal}`);
    doc.text(`Other Charges: ${salesReturn?.otherCharges}`);
    doc.text(`Discount: ${salesReturn?.discount}`);
    doc
      .fontSize(8)
      .text(`Total Amount: ${salesReturn?.totalAmount}`, { bold: true })
      .moveDown(1);

    // Reason for Return
    doc
      .fontSize(8)
      .text("Reason for Return:", { underline: true })
      .text(salesReturn.reason || "N/A")
      .moveDown();

    // Footer
    doc
      .fontSize(8)
      .text("Thank you for your cooperation!", { align: "center" })
      .moveDown(0.5)
      .text("This is a computer-generated invoice.", { align: "center" })
      .text(`Generated on ${new Date().toLocaleString("en-IN")}`, {
        align: "center",
      });

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

module.exports = generateSalesReturnInvoice;
