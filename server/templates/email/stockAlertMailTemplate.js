const stockAlertMailTemplate = (product) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Stock Alert Notification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          color: #333;
          line-height: 1.5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        h2 {
          color: #007BFF;
        }
        p {
          margin: 10px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Stock Alert Notification</h2>
        <p>Hi there,</p>
        <p>This is to inform you that a stock alert has been set for the product <strong>${product.name}</strong>.</p>
        <p>You will receive a notification when the stock level reaches <strong>${product.stockAlert.quantity} ${product.secondaryUnit}</strong>.</p>
        <p>Thank you for staying updated!</p>
        <p class="footer">
          Best regards, <br>
          <strong>Your Company Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;
};

module.exports = stockAlertMailTemplate;
