const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const Sale = require("../models/sale.model");
const Company = require("../models/company.model");

const getEmployees = async (req, res) => {
  const { limit = 10, page = 1, sort = "name", sortType = "asc" } = req.query;
  const employees = await User.find({company: req.user.company})
    .sort({ [sort]: sortType })
    .limit(limit)
    .skip((page - 1) * limit);

  const totalResults = await User.countDocuments({company: req.user.company});

  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, employees, page, totalResults, totalPages });
};

const getEmployee = async (req, res) => {
  const employee = await User.findOne({ uuid: req.params.uuid, company: req.user.company });
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  res.json({ success: true, employee });
};

const addEmployee = async (req, res) => {
  const employee = req.body;

  const company = await Company.findById(req.user.company).select("initials").lean();

  const generateUUID = async () => {
    let uuid =
      "EMP" +
      company.initials.toUpperCase() +
      Math.random().toString(36).substr(2, 6).toUpperCase();
    const existingUser = await User.findOne({ uuid });
    if (existingUser) {
      return generateUUID();
    } else {
      return uuid;
    }
  };

  employee.uuid = await generateUUID();
  employee.company = req.user.company;

  const tempPass = req.body.name.split(" ")[0].toLowerCase() + "@123";

  const salt = await bcrypt.genSalt(10);
  employee.password = await bcrypt.hash(tempPass, salt);

  // Upload Image if exists
  if (req.files) {
    const { avatar, identityProof } = req.files;
    if (avatar) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          avatar[0].path,
          { folder: `${company?.licenseKey}/employees` }
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
    if (identityProof) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          identityProof[0].path,
          { folder: `${company?.licenseKey}/employees` }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload employee identity proof to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        employee.identityProof = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload employee identity proof to cloud.",
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
  const employee = await User.findOne({ uuid: uuid , company: req.user.company});
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  employee.name = name;
  employee.email = email;
  employee.phone = phone;
  employee.address = address;

  const company = await Company.findById(req.user.company).select("licenseKey").lean();

  // Upload Image if exists
  if (req.files) {
    const { avatar, identityProof } = req.files;
    if (avatar) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          avatar[0].path,
          { folder: `${company?.licenseKey}/employeeImages` }
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
    if (identityProof) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          identityProof[0].path,
          { folder: `${company?.licenseKey}/employeeImages` }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload employee identity proof to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        employee.identityProof = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload employee identity proof to cloud.",
          error: error.message,
        });
      }
    }
  }

  await employee.save();
  res.json({ success: true, employee });
};

const updatePrefences = async (req, res) => {
  const { preferences, uuid } = req.body;
  const employee = await User.findOne({ uuid: uuid }).populate("company");
  if (!employee) {
    return res.json({ success: false, message: "User not found" });
  }
  employee.preferences = preferences;
  await employee.save();
  res.json({ success: true, user: employee });
};

const deleteEmployee = async (req, res) => {
  const employee = await User.findOne({ uuid: req.params.uuid, company: req.user.company });
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }
  await employee.remove();
  res.json({ success: true, message: "Employee deleted" });
};

const getEmployeeSales = async (req, res) => {
  const employee = await User.findOne({ uuid: req.params.uuid, company: req.user.company });
  if (!employee) {
    return res.json({ success: false, message: "Employee not found" });
  }

  //Sales with pagination
  const {
    limit = 10,
    page = 1,
    sort = "createdAt",
    sortType = "asc",
  } = req.query;
  const sales = await Sale.find({ signedBy: employee._id, company: req.user.company })
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ [sort]: sortType })
    .populate("signedBy");

  const totalResults = await Sale.countDocuments({ signedBy: employee._id, company: req.user.company });

  const totalPages = Math.ceil(totalResults / limit) || 1;

  res.json({ success: true, page, totalResults, totalPages, sales });
};

module.exports = {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  updatePrefences,
  getEmployeeSales,
  deleteEmployee,
};
