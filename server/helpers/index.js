require("dotenv").config();
const nodemailer = require("nodemailer");

const sendMail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
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
        batch1.purchaseRate == batch2.purchaseRate &&
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

module.exports = { sendMail, mergeBatchesHelper };
