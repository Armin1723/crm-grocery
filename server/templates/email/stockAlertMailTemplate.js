const stockAlertMailTemplate = (product) => {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <p>Hi there,</p>
        <p>Stock alert set for ${product.name}.</p>
        <p>You will be notified when the stock reaches ${product.stockAlert.quantity} ${product.secondaryUnit}.</p>
        <p>Regards</p>
    </div>`;
};

module.exports = stockAlertMailTemplate;
