const emailHeader = require("./emailHeader");
const emailFooter = require("./emailFooter");

const lowStockProductsMailTemplate = (products, company) => {
  const fallbackImage =
    "https://res.cloudinary.com/drhhsmsoa/image/upload/v1737806587/product-placeholder_qoq8ez.png";

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
              <th>Remaining Stock</th>
              <th>Stock Alert Threshold</th>
            </tr>
          </thead>
          <tbody>
            ${products
              .map(
                (product) => `
              <tr>
                <td><img src="${
                  product?.product?.image || fallbackImage
                }" alt="${product?.product?.name}" class="product-image" /></td>
                <td>${product?.product?.name}</td>
                <td>${product?.product?.category}</td>
                <td>${product?.quantity} ${product?.product?.secondaryUnit}</td>
                <td>${product?.product?.stockAlert?.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      : '<p class="no-products">No low-stock products at the moment</p>';
  };

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
      <div class="container">
        <h1>Low Stock Alert</h1>
        <div class="alert">
          <p>The following products are running low on stock:</p>
        </div>
        ${createProductTable(products)}
        <p>Please restock these products as soon as possible to avoid any inconvenience.</p>
        <p>Thank you for your attention.</p>
      </div>
      ${emailFooter(company)}
    </body>
    </html>
  `;
};

module.exports = lowStockProductsMailTemplate;
