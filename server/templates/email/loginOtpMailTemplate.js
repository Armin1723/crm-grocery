const emailFooter = require("./emailFooter");
const emailHeader = require("./emailHeader");

const loginOtpMailTemplate = (otp, name, company) => {
  return (
    `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Login OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        ` +
    emailHeader(company) +
    `
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <h2 style="color: #5d3fd3;">Login OTP</h2>
        <p>Hi ${name},</p>
        <p>Your OTP for login is: <strong>${otp}</strong></p>
        </div>
        ` +
    emailFooter(company) +
    `
    </body>
</html>
`
  );
};

module.exports = loginOtpMailTemplate;
