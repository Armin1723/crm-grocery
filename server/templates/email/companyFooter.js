const companyFooter = () => {
  return `
        <div style="background-color: #f8f9fa; padding: 6px; align-items: center; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd;">
          <p>&copy; ${new Date().getFullYear()} CRM Grocery. All rights reserved.</p>
          <p>ABC, Street Road, Dubagga Lucknow, India 226003</p>
          <p>Phone: +91 12345 67890</p>
          <p>Email: support@crm.com</p>
          <p><a href="https://crm-grocery.netlify.app" style="color: #5d3fd3; text-decoration: none;">https://crm-grocery.netlify.app</a></p>
          <p style="margin-top: 4px;">This is an automated email. Please do not reply directly to this message.</p>
        </div>
      `;
};

module.exports = companyFooter;
