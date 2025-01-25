const saleInvoiceMailTemplate = (sale) => {
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
          .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .flex .left {
            font-weight: bold;
            font-size: 14px; 
          }
          .flex .right {
            font-weight: normal;
            font-size: 14px; 
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
          .total {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
          }
          .total .left {
            font-weight: bold;
            font-size: 14px; 
          }
          .total .right {
            font-weight: normal;
            font-size: 14px;
          }
          .download {
            margin-top: 20px;
            text-align: center;
          }
          .download a {
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
              font-size: 18px; /* Adjusted font size */
            }
            .section h2 {
              font-size: 16px; /* Adjusted font size */
            }
            .flex {
              flex-direction: column;
              align-items: flex-start;
            }
            .flex .left, .flex .right {
              font-size: 12px; /* Adjusted font size */
            }
            .total {
              flex-direction: column;
              align-items: flex-start;
            }
            .download a {
              font-size: 14px;
              padding: 8px 15px;
            }

            table {
              width: 100%;
              font-size: 12px; /* Adjusted font size for mobile */
            }
            table th, table td {
              padding: 6px;
              text-align: center;
            }
            table th {
              background-color: #343a40;
              color: #fff;
            }
            table tbody tr {
              border-bottom: 1px solid #343a40;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sale Invoice</h1>
          </div>

          <div class="section">
            <h2>Customer Details</h2>
            <div class="flex">
              <div class="left">Name:</div>
              <div class="right">${sale?.customer?.name || 'No name'}</div>
            </div>
            <div class="flex">
              <div class="left">Email:</div>
              <div class="right">${sale?.customer?.email || 'No email'}</div>
            </div>
            <div class="flex">
              <div class="left">Phone:</div>
              <div class="right">${sale?.customer?.phone || 'No contact'}</div>
            </div>
          </div>

          <div class="section">
            <h2>Sale Details</h2>
            <div class="flex">
              <div class="left">Sale ID:</div>
              <div class="right">${sale._id}</div>
            </div>
            <div class="flex">
              <div class="left">Date:</div>
              <div class="right">${new Date(sale.createdAt).toDateString()}</div>
            </div>
          </div>

          <div class="section">
            <h2>Sold Products</h2>
            <div class="table-container">
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
                      <td>${product.quantity} ${product?.product?.secondaryUnit}</td>
                      <td>₹${product.sellingRate}</td>
                      <td>₹${product.quantity * product.sellingRate}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="total">
            <div class="left">Total Amount:</div>
            <div class="right">₹${sale.totalAmount}</div>
          </div>

          <div class="download">
            <a href="${sale?.invoice}">Download Invoice</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = saleInvoiceMailTemplate;
