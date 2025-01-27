require("dotenv").config();

const passwordResetMailTemplate = (name, resetPasswordToken) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
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
          margin-bottom: 20px;
        }
        p {
          margin: 10px 0;
        }
        a {
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #5d3fd3;
          border: 1px solid #5d3fd3;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          color: #fff;
        }
        .button:hover {
          background-color: #5d3fd3b0;
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
        <h2>Password Reset Request</h2>
        <p style="text-transform: capitalize;">Hi <span style="font-weight: bold;">${name}</span>,</p>
        <p>We received a request to reset your password. If you didn’t make this request, you can safely ignore this email.</p>
        <p>To reset your password, use the OTP below:</p>
        <p style="text-align: center; font-size: 20px;">
          Your OTP to reset password is: <strong>${resetPasswordToken}</strong>
        </p>
        <p class="footer">
          Regards, <br>
          <strong>The Team</strong>
        </p>
      </div>
    </body>
    </html>
  `;
};

module.exports = passwordResetMailTemplate;
