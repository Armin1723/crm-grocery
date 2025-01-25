require('dotenv').config();

const welcomeEmployeeMail = (employee) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Team</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #ffffff;
        }
        h2 {
          color: #4CAF50;
          margin-bottom: 20px;
        }
        p {
          margin: 10px 0;
        }
        a {
          color: #4CAF50;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
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
        <h2>Welcome ${employee.name}!</h2>
        <p>We are thrilled to have you as part of our team. Your employee ID is <strong>${employee.id}</strong>.</p>
        <p>Your initial password is your first name followed by <strong>@123</strong>. We strongly recommend changing your password after your first login.</p>
        <p>To access your account, log in <a href="${process.env.FRONTEND_URL}/login" target="_blank">here</a>.</p>
        <p>Welcome aboard!</p>
        <p class="footer">
          Best regards, <br>
          <strong>The Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;
}

module.exports = welcomeEmployeeMail;
