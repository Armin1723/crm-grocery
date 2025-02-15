const companyRegistrationMailTemplate = (user, company) => {
  const { name } = user;
  const {
    name: companyName,
    subscriptionStartDate: startDate,
    subscriptionEndDate: endDate,
  } = company;
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Company Registration Successful</title>
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
          <h2>Congratulations <strong>${name}</strong> on Registering Your Company, ${companyName}!</h2>
          <p>We are thrilled to welcome you to our platform.</p>
          <p>Your free trial starts on <strong>${startDate}</strong> and will end on <strong>${endDate}</strong>.</p>
          <p>Enjoy exploring all the features available to help your business grow. If you have any questions, feel free to reach out to our support team.</p>
          <p>We’re excited to be part of your journey!</p>
        </div>
      </body>
      </html>
    `;
};

module.exports = companyRegistrationMailTemplate;
