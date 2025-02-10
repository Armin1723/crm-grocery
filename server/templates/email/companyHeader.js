const fs = require('fs');
const path = require('path');

const convertImageToBase64 = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString('base64')}`;
};

const companyHeader = () => {
    return `
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
          <img src=${convertImageToBase64(path.join(__dirname, './logo.png'))} alt="CRM Grocery" style="max-height: 60px; margin-bottom: 10px;">
          <h1 style="color: #5d3fd3; margin: 0; font-size: 24px;">CRM Grocery</h1>
          <p style="margin: 3px 0; color: #666;">ABC, Street Road, Dubagga Lucknow, India 226003</p>
          <p style="margin: 3px 0; color: #666;">Phone: +91 12345 67890</p>
          <p style="margin: 3px 0; color: #666;">Email: support@crm.com</p>
          <p style="margin: 3px 0;"><a href="https://crm-grocery.netlify.app" style="color: #5d3fd3; text-decoration: none;">https://crm-grocery.netlify.app</a></p>
        </div>
          `
  };
  
  module.exports = companyHeader;
  