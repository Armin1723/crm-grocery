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
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
        }
        h2 {
          color: #5d3fd3;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          color: #5d3fd3;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, use the OTP below:</p>
        <p class="otp">${resetPasswordToken}</p>
      </div>
    </body>
    </html>
  `
}

module.exports = passwordResetMailTemplate

