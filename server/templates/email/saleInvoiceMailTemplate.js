const saleInvoiceMailTemplate = (customer, invoice) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
    <div style="margin: 0.5in;">
    <p>Dear ${customer?.name || "Customer"},</p>
    <p>Thank you for your purchase. <a href="${invoice}" target="_blank">Here</a> is your invoice.</p>
    <p>Thank you for your business.</p>
    <p>Best regards,</p>
    <p>Your Grocery Store</p>
    </div>  
    </div>
    `;
};

module.exports = saleInvoiceMailTemplate;
