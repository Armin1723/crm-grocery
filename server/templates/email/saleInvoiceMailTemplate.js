const saleInvoiceMailTemplate = (sale) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
            width: 100%;
          }
          .header {
            background-color: #f8f9fa;
            padding: 10px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: #343a40;
            font-size: 24px;
          }
          .content {
            padding: 20px;
            background-color: #f8f9fa;
            width: 100%;
          }
          .content h2 {
            margin: 0;
            color: #343a40;
            font-size: 20px;
          }
          .content p {
            margin: 0;
            color: #343a40;
            font-size: 16px;
          }
          .content .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .content .flex .left {
            font-weight: bold;
            font-size: 16px;
          }
          .content .flex .right {
            font-weight: normal;
            font-size: 16px;
          }
          .content .total {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 10px;
          }
          .content .total .left {
            font-weight: bold;
            font-size: 16px;
          }
          .content .total .right {
            font-weight: normal;
            font-size: 16px;
          }
          .content .download {
            margin-top: 20px;
            text-align: center;
          }
          .content .download a {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
          }

          /* Responsive Styles */
          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }
            .header h1 {
              font-size: 20px;
            }
            .content h2 {
              font-size: 18px;
            }
            .content .flex {
              flex-direction: column;
              align-items: flex-start;
            }
            .content .flex .left,
            .content .flex .right {
              font-size: 14px;
            }
            .content .total {
              flex-direction: column;
              align-items: flex-start;
            }
            .content .download a {
              font-size: 14px;
              padding: 8px 15px;
            }

            table {
              width: 100%;
              font-size: 14px;
              border-collapse: collapse;
            }
            table th,
            table td {
              padding: 10px;
              text-align: center;
            }
            table th {
              background-color: #343a40;
              color: #fff;
            }
            table tbody tr {
              border-bottom: 1px solid #343a40;
            }
            table tbody td img {
              width: 50px;
              height: 50px;
              object-fit: cover;
            }
          }

          /* Additional large screen tweaks */
          @media (min-width: 768px) {
            .container {
              max-width: 800px;
              padding: 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .content .flex {
              flex-direction: row;
            }
            .content .flex .left,
            .content .flex .right {
              font-size: 16px;
            }
            .content .download a {
              font-size: 16px;
              padding: 10px 20px;
            }
            table {
              width: 100%;
              font-size: 16px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sale Invoice</h1>
          </div>
          <div class="content">
            <h2>Customer Details</h2>
            <div class="flex">
              <div class="left">Name: </div>
              <div class="right">${sale?.customer?.name || 'No name'}</div>
            </div>
            <div class="flex">
              <div class="left">Email: </div>
              <div class="right">${sale?.customer?.email || 'No email'}</div>
            </div>
            <div class="flex">
              <div class="left">Phone: </div>
              <div class="right">${sale?.customer?.phone || 'No contact'}</div>
            </div>
            <h2>Sale Details</h2>
            <div class="flex">
              <div class="left">Sale ID: </div>
              <div class="right">${sale._id}</div>
            </div>
            <div class="flex">
              <div class="left">Date: </div>
              <div class="right">${new Date(sale.createdAt).toDateString()}</div>
            </div>
            <div class="products">
              <h2>Sold Products</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${sale.products
                    .map(
                      (product) => `
                    <tr>
                      <td>${product?.product?.name}</td>
                      <td>${product.quantity}</td>
                      <td>₹${product.sellingRate}</td>
                      <td>₹${product.quantity * product.sellingRate}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
              <div class="total">
                <div class="left">Total Amount : </div>
                <div class="right"> ₹${sale.totalAmount}</div>
              </div>
            </div>
            <div class="download">
              <a href="${sale.invoice}" target="_blank">Download Invoice PDF</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = saleInvoiceMailTemplate;
