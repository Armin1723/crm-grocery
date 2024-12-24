const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const getEmployees = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const employees = await User.find({ role: "employee" })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalEmployees = await User.countDocuments({ role: "employee" });

    const totalPages = Math.ceil(totalEmployees / limit) || 1;

    res.json({ success: true, employees, page, totalEmployees, totalPages });
};

const getEmployee = async (req, res) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }
    res.json({ success: true, employee });
};

const addEmployee = async (req, res) => {
    const employee = req.body;

    const generateUUID = async () => {
      let uuid = "EMP" +
        process.env.INITIALS +
        Math.random().toString(36).substr(2, 6).toUpperCase();
      const existingUser = await User.findOne({ uuid });
      if (existingUser) {
        return generateUUID();
      } else {
        return uuid;
      }
    };

    employee.uuid = await generateUUID();

    const tempPass = req.body.name.split(" ")[0].toLowerCase() + "@123";

    const salt = await bcrypt.genSalt(10);
    employee.password = await bcrypt.hash(tempPass, salt);

    if(employee.gender === 'male'){
      employee.avatar = 'https://avatar.iran.liara.run/public/boy'
    }else{
      employee.avatar = 'https://avatar.iran.liara.run/public/girl'
    }

    const newEmployee = await User.create(employee);

    res.json({ success: true, employee: newEmployee });
};

const editEmployee = async (req, res) => {
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
};

const deleteEmployee = async (req, res) => {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }
    await employee.remove();
    res.json({ success: true, message: "Employee deleted" });
};

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  deleteEmployee,
};
