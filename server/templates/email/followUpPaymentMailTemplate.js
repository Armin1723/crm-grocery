const followUpPaymentMailTemplate = (supplierName, amount, purchaseId) => {
    return `
        <div style="font-family: Arial, sans-serif;">
            <p>Dear ${supplierName},</p>
            <p style="color: #000;">We are pleased to inform you that we have received a payment of <strong>${amount}</strong> for the purchase with ID <strong>${purchaseId}</strong>.</p>
            <p style="color: #000;">We appreciate your prompt payment and your continued partnership with us.</p>
            <p style="color: #000;">If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
            <p style="color: #000;">Thank you for your business.</p>
            <p style="color: #000;">Best regards,</p>
            <p style="color: #000;"><strong>Your Company Name</strong></p>
            <p style="color: #000;">Email: support@yourcompany.com</p>
            <p style="color: #000;">Phone: (123) 456-7890</p>
        </div>
    `;
};

module.exports = followUpPaymentMailTemplate;