const lowStockMailTemplate = (productName, remainingStock) => {
    return `
        <div style="font-family: Arial; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h1 style="color: #5d3fd3;">Low Stock Alert</h1>
            <p>Product <strong>${productName}</strong> is running low on stock. Remaining stock: <strong>${remainingStock}</strong></p>
            <p>Please restock the product as soon as possible to avoid any inconvenience.</p>
            <p>Thank you for your attention.</p>
        </div>
    `;
};

module.exports = lowStockMailTemplate;
