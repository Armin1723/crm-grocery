const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
            },
            purchaseRate: {
                type: Number,
            },
            sellingRate: {  
                type: Number,
            },
}, { timestamps: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;