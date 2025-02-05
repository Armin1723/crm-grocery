const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const followUpPaymentMailTemplate = (supplierName, amount, purchaseId, company) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Received</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
        }
        h2 {
          color: #5d3fd3;
        }
      </style>
    </head>
    <body>
      ${emailHeader(company)}
      <div class="container">
        <h2>Payment Received</h2>
        <p>Dear ${supplierName},</p>
        <p>We are pleased to inform you that we have received a payment of <strong>${amount}</strong> for the purchase with ID <strong>${purchaseId}</strong>.</p>
        <p>We appreciate your prompt payment and your continued partnership with us.</p>
        <p>If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
        <p>Thank you for your business.</p>
      </div>
      ${emailFooter(company)}
    </body>
    </html>
  `
}

module.exports = followUpPaymentMailTemplate

