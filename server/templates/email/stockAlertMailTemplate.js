const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const stockAlertMailTemplate = (product, company) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stock Alert</title>
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
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
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
        <h2>Stock Alert</h2>
        <p>Hi there,</p>
        <p>Stock alert set for <strong>${product.name}</strong>.</p>
        <p>You will be notified when the stock reaches <strong>${product.stockAlert.quantity} ${product.secondaryUnit}</strong>.</p>
      </div>
      ${emailFooter(company)}
    </body>
    </html>
  `
}

module.exports = stockAlertMailTemplate

