const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const expiringProductsTemplateMail = (
  productsExpiringToday,
  productsExpiringThisWeek,
  productsExpiringThisMonth,
  company,
) => {
  const fallbackImage = "https://res.cloudinary.com/drhhsmsoa/image/upload/v1737806587/product-placeholder_qoq8ez.png"

  const createProductTable = (products) => {
    return products.length > 0
      ? `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>UPID</th>
              <th>Expiry Date</th>
              <th>Total Quantity</th>
              <th>Purchase Rate</th>
              <th>Selling Rate</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td><img src="${product.image || fallbackImage}" alt="${product.product}" class="product-image" /></td>
                <td>${product.product}</td>
                <td>${product.category}</td>
                <td>${product.upid}</td>
                <td>${new Date(product.expiry).toLocaleDateString()}</td>
                <td>${product.quantity} ${product.secondaryUnit}</td>
                <td>₹${product.purchaseRate}</td>
                <td>₹${product.sellingRate}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      : '<p class="no-products">No products expiring in this period</p>'
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Product Expiry Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .section {
            background-color: #f8f9fa;
            padding: 15px;
          }
          .section h2 {
            color: #5d3fd3;
            border-bottom: 2px solid #5d3fd3;
            padding-bottom: 10px;
          }
          .table-container {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
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
          .no-products {
            color: #6c757d;
            font-style: italic;
            text-align: center;
          }
          .product-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
          }
        </style>
      </head>
      <body>
        ${emailHeader(company)}
        <div class="section">
          <h2>Products Expiring Today</h2>
          ${createProductTable(productsExpiringToday)}
        </div>
        <div class="section">
          <h2>Products Expiring This Week</h2>
          ${createProductTable(productsExpiringThisWeek)}
        </div>
        <div class="section">
          <h2>Products Expiring This Month</h2>
          ${createProductTable(productsExpiringThisMonth)}
        </div>
        ${emailFooter(company)}
      </body>
    </html>
  `
}

module.exports = expiringProductsTemplateMail

