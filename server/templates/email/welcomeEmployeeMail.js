const emailHeader = require("./emailHeader")
const emailFooter = require("./emailFooter")

const welcomeEmployeeMail = (employee, company) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Team</title>
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
        h2 {
          color: #5d3fd3;
        }
        a {
          color: #5d3fd3;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      ${emailHeader(company)}
      <div class="container">
        <h2 style="text-transform: capitalie; ">Welcome ${employee.name}!</h2>
        <p>We are excited to have you on board. Your employee ID is <strong>${employee.id}</strong>.</p>
        <p>Your initial password is your first name followed by <strong>@123</strong>. Please change your password after logging in.</p>
      </div>
      ${emailFooter(company)}
    </body>
    </html>
  `
}

module.exports = welcomeEmployeeMail

