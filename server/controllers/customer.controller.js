const Customer = require("../models/customer.model");

const getCustomer = async (req, res) => {
    const { phone = 1234 } = req.params;
        const customer = await Customer.findOne({ phone });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.json({ success:true, customer });
}

const addEditCustomer = async (req, res) => {
    const { name, email, phone, address } = req.body;
    if (!phone) {
        return res.status(400).json({ message: "Phone number is required", customer: null });
    }
    const customer = await Customer.findOneAndUpdate(
        { phone },
        { name, email, address },
        { new: true, upsert: true }
    );
    res.json({ success: true, customer : {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
    } });
}

module.exports = {
    getCustomer,
    addEditCustomer,
};