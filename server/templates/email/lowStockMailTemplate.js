const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const lowStockMailTemplate = (productName, remainingStock, company) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Low Stock Alert</title>
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
          background-color: #ffffff;
          padding: 20px;
          border-radius: 5px;
        }
        h1 {
          color: #5d3fd3;
        }
        .alert {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          color: #856404;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      ${emailHeader(company)}
      <div class="container">
        <h1>Low Stock Alert</h1>
        <div class="alert">
          <p>Product <strong>${productName}</strong> is running low on stock.</p>
          <p>Remaining stock: <strong>${remainingStock}</strong></p>
        </div>
        <p>Please restock the product as soon as possible to avoid any inconvenience.</p>
        <p>Thank you for your attention.</p>
      </div>
      ${emailFooter(company)}
    </body>
    </html>
  `
}

module.exports = lowStockMailTemplate

