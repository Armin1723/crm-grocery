const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const getEmployees = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const employees = await User.find({ role: "employee" })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalEmployees = await User.countDocuments({ role: "employee" });

    const totalPages = Math.ceil(totalEmployees / limit) || 1;

    res.json({ success: true, employees, page, totalEmployees, totalPages });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const addEmployee = async (req, res) => {
  try {
    const employee = req.body;

    const generateUUID = async () => {
      let uuid = "EMP" +
        process.env.INITIALS +
        Math.random().toString(36).substr(2, 6).toUpperCase();
      const existingProduct = await User.findOne({ uuid });
      if (existingProduct) {
        return generateUUID();
      } else {
        return uuid;
      }
    };

    employee.uuid = await generateUUID();

    const tempPass = req.body.name.split(" ").join("").toLowerCase() + "@123";

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(tempPass, salt);

    if(employee.gender === 'male'){
      employee.avatar = 'https://avatar.iran.liara.run/public/boy'
    }else{
      employee.avatar = 'https://avatar.iran.liara.run/public/girl'
    }

    const newEmployee = await User.create(employee);

    res.json({ success: true, employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const editEmployee = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }
    employee.name = name;
    employee.email = email;
    employee.phone = phone;
    employee.address = address;
    await employee.save();
    res.json({ success: true, employee });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }
    await employee.remove();
    res.json({ success: true, message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  deleteEmployee,
};
