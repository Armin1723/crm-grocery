const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const saleReturnInvoiceMailTemplate = (saleReturn, company) => {
  const header = emailHeader(company)
  const footer = emailFooter(company)

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sale Return Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
          }
          h2 {
            color: #5d3fd3;
          }
          .flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .flex .left {
            font-weight: bold;
          }
          table {
            width: auto;
            max-width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #5d3fd3;
            color: #fff;
          }
          .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
          .total {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }
            .download {
            text-align: center;
            margin-top: 20px;
          }
          .download a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #5d3fd3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        ${header}
        <div class="content">
          <h2>Customer Details</h2>
          <div class="flex">
            <div class="left">Name:</div>
            <div class="right">${saleReturn?.customer?.name || "No name"}</div>
          </div>
          <div class="flex">
            <div class="left">Email:</div>
            <div class="right">${saleReturn?.customer?.email || "No Email"}</div>
          </div>
          <div class="flex">
            <div class="left">Phone:</div>
            <div class="right">${saleReturn?.customer?.phone || "No Contact"}</div>
          </div>
          <h2>Return Details</h2>
          <div class="flex">
            <div class="left">Return ID:</div>
            <div class="right">${saleReturn._id}</div>
          </div>
          <div class="flex">
            <div class="left">Date:</div>
            <div class="right">${new Date(saleReturn.createdAt).toDateString()}</div>
          </div>
          <h2>Returned Products</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${saleReturn.products
                .map(
                  (product) => `
                <tr>
                  <td><img src="${product?.product?.image}" alt="${product?.product?.name}" class="product-image" /></td>
                  <td>${product?.product?.name}</td>
                  <td>${product.quantity} ${product?.product?.secondaryUnit}</td>
                  <td>₹${product.sellingRate}</td>
                  <td>₹${product.quantity * product.sellingRate}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            <div class="left">Total Amount:</div>
            <div class="right">₹${saleReturn.totalAmount}</div>
          </div>
          <div class="download">
            <a href="${saleReturn.invoice}" target="_blank">Download Invoice PDF</a>
          </div>
        </div>
        ${footer}
      </body>
    </html>
  `
}

module.exports = saleReturnInvoiceMailTemplate

