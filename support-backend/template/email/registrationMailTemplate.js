const registrationMailTemplate = (name, email, otp) => {
  return `
    <html>
    <head>
        <style>
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                box-sizing: border-box;
            }
            .header {
                background-color: #f9f9f9;
                padding: 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
            }
            .otp{
                font-size: 24px;
                color: #333;
            }
            .footer {
                background-color: #f9f9f9;
                padding: 20px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Registration OTP</h1>
            </div>
            <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for registering with us. Your OTP is </p>
                <strong class="otp">${otp}</strong>
            </div>
            <div class="footer">
                <p>Regards, <br>Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = registrationMailTemplate;
