const saleReturnInvoiceMailTemplate = (saleReturn) => {
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
      }
      .content {
        padding: 20px;
        background-color: #f8f9fa;
      }
      .content h2 {
        margin: 0;
        color: #343a40;
      }
      .content p {
        margin: 0;
        color: #343a40;
      }
      .content .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .content .flex .left {
        font-weight: bold;
      }
      .content .flex .right {
        font-weight: normal;
      }
      .content .products {
        margin-top: 20px;
      }
      .content .products table {
        width: 100%;
        border-collapse: collapse;
      }
      .content .products table thead {
        background-color: #343a40;
        color: #fff;
      }
      .content .products table thead th {
        padding: 10px;
        text-align: left;
      }
      .content .products table tbody tr {
        border-bottom: 1px solid #343a40;
      }
      .content .products table tbody tr:last-child {
        border-bottom: none;
      }
      .content .products table tbody td {
        padding: 10px;
      }
      .content .products table tbody td img {
        width: 50px;
        height: 50px;
        object-fit: cover;
      }
      .content .products .total {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
      }
      .content .products .total .left {
        font-weight: bold;
      }
      .content .products .total .right {
        font-weight: normal;
      }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Return Invoice</h1>
        </div>
        <div class="content">
          <h2>Customer Details</h2>
          <div class="flex">
            <div class="left">Name: 
            </div>
            <div class="right"> ${saleReturn?.customer?.name || 'No name'}</div>
            </div>
            <div class="flex">
              <div class="left">Email: </div>
              <div class="right"> ${saleReturn?.customer?.email || 'No Email'}</div>
            </div>
            <div class="flex">
              <div class="left">Phone: </div>
              <div class="right"> ${saleReturn?.customer?.phone || 'No Contact'}</div>
            </div>
            <h2>Return Details</h2>
            <div class="flex">
              <div class="left">Return ID: </div>
              <div class="right"> ${saleReturn._id}</div>
            </div>
            <div class="flex">
              <div class="left">Date
                </div>
                <div class="right">${new Date(
                  saleReturn.createdAt
                ).toDateString()}</div>
                </div>
                <div class="products">
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
                          <td><img src="${product?.product?.image}" alt="${
                            product?.product?.name
                          }" /></td>
                          <td>${product?.product?.name}</td>
                          <td>${product.quantity}</td>
                          <td>₹${product.sellingRate}</td>
                          <td>₹${product.quantity * product.sellingRate}</td>
                        </tr>
                      `
                        )
                        .join("")}
                    </tbody>
                  </table>
                  <div class="total">
                    <div class="left">Total Amount</div>
                    <div class="right">₹${saleReturn.totalAmount}</div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
        `;
};

module.exports = saleReturnInvoiceMailTemplate;
