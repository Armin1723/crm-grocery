const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const Sale = require("../models/sale.model");

const getEmployees = async (req, res) => {
  const { limit = 10, page = 1, sort = 'name', sortType = 'asc' } = req.query;
  const employees = await User.find()
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalResults = await User.countDocuments();

  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, employees, page, totalResults, totalPages });
};

const getEmployee = async (req, res) => {
  const employee = await User.findOne({ uuid: req.params.uuid });
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  res.json({ success: true, employee });
};

const addEmployee = async (req, res) => {
  const employee = req.body;

  const generateUUID = async () => {
    let uuid =
      "EMP" +
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

  // Upload Image if exists
  if (req.files) {
    const { avatar } = req.files;
    if (avatar) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          avatar[0].path,
          { folder: "Employee_Images" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload employee image to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        employee.avatar = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload employee image to cloud.",
          error: error.message,
        });
      }
    }
  }

  const newEmployee = await User.create(employee);

  res.json({ success: true, employee: newEmployee });
};

const editEmployee = async (req, res) => {
  const { name, email, phone, address, uuid } = req.body;
  const employee = await User.findOne({uuid : uuid});
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  employee.name = name;
  employee.email = email;
  employee.phone = phone;
  employee.address = address;

  // Upload Image if exists
    if (req.files) {
      const { avatar } = req.files;
      if (avatar) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar[0].path,
            { folder: "Employee_Images" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return res.status(500).json({
              success: false,
              message: "Failed to upload employee image to cloud.",
              error: cloudinaryResponse.error,
            });
          }
          employee.avatar = cloudinaryResponse.secure_url;
          await employee.save();
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload employee image to cloud.",
            error: error.message,
          });
        }
      }
    }

  await employee.save();
  res.json({ success: true, employee });
};

const deleteEmployee = async (req, res) => {
  const employee = await User.findOne({uuid : req.params.uuid});
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  await employee.remove();
  res.json({ success: true, message: "Employee deleted" });
};

const getEmployeeSales = async (req, res) => {
  const employee = await User.findOne({ uuid: req.params.uuid });
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }

  //Sales with pagination 
  const { limit = 5, page = 1, skip = 0 } = req.query;
  const sales = await Sale.find({ employee: employee._id })
    .limit(limit)
    .skip(skip);
  
  const hasMore = await Sale.countDocuments() > skip + limit;

  res.json({ success: true, sales, hasMore });
}

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  getEmployeeSales,
  deleteEmployee,
};
