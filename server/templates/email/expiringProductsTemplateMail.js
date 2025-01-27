const expiringProductsTemplateMail = (
  productsExpiringToday,
  productsExpiringThisWeek,
  productsExpiringThisMonth
) => {

  const fallbackImage = 'https://res.cloudinary.com/drhhsmsoa/image/upload/v1737806587/product-placeholder_qoq8ez.png';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            font-size: 14px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f8f9fa;
            padding: 10px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #343a40;
            font-size: 20px;
          }
          .section {
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          .section h2 {
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            font-size: 18px;
          }
          .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
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
            background-color: #f2f2f2;
            font-weight: bold;
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
        <div class="container">
          <div class="header">
            <h1>Product Expiry Notification</h1>
          </div>

          <div class="section">
            <h2>Products Expiring Today</h2>
            ${
              productsExpiringToday.length > 0
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
                    ${productsExpiringToday
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
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
                : '<p class="no-products">No products expiring today</p>'
            }
          </div>

          ${
            productsExpiringThisWeek.length > 0
              ? `
          <div class="section">
            <h2>Products Expiring This Week</h2>
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
                  ${productsExpiringThisWeek
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
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          `
              : ""
          }

          ${
            productsExpiringThisMonth.length > 0
              ? `
          <div class="section">
            <h2>Products Expiring This Month</h2>
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
                  ${productsExpiringThisMonth
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
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;
};

module.exports = expiringProductsTemplateMail;
