const registerMailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Platform</title>
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
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Welcome ${name}!</h2>
        <p>We are excited to have you on board.</p>
        <p>Your initial password is your first name followed by '@' and the last four digits of your mobile number. Please change your password after logging in.</p>
        <p>Log in to continue.</p>
      </div>
    </body>
    </html>
  `
}

module.exports = registerMailTemplate

