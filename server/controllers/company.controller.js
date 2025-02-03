const Company = require("../models/company.model");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user.model");

const addCompany = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.address ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.initials
  ) {
    return res.status(400).json({ message: "All fields are required" , errors: {
      name: "Company name is required",
      address: "Company address is required",
      email: "Company email is required",
      phone: "Company phone is required",
      initials: "Company initials is required"
    }});
  }
  const existingCompany = await Company.findOne({ name: req.body.name });
  if (existingCompany) {
    return res.status(400).json({ success: false, message: "Company already exists", errors:{
      name: "Company name already exists"
    } });
  }
  const existingInitials = await Company.findOne({
    initials: req.body.initials,
  });
  if (existingInitials) {
    return res.status(400).json({ message: "Initials already exists", success: false, errors:{
      initials: "Company initials already taken."
    } });
  }

  // Generate license key and trial end date
  const licenseKey = 'CRM' + Math.random().toString(36).substr(2, 10).toUpperCase() + req.body.initials.toUpperCase() + new Date().getTime();
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 7);

  const company = await Company.create({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    gstin: req.body.gstin,
    branch: req.body.branch,
    initials: req.body.initials,
    admin: req.user.id,
    subscription: "trial",
    subscriptionStartDate: new Date(),
    subscriptionEndDate,
    licenseKey,
  });

  //logo upload
  if (req.files) {
    const { logo } = req.files;
    if (logo) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          logo[0].path,
          { folder: `${company.licenseKey}/companyData` }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload company logo to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        company.logo = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload company logo to cloud.",
          error: error.message,
        });
      }
    }
  }

  await company.save();

  const user = await User.findByIdAndUpdate(req.user.id, {
    company: company._id,
  });

  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "Strict",
    secure: process.env.ENVIRONMENT === "prod",
  });

  res.status(201).json({
    message: "Company created successfully , Login again to continue.",
    user,
    company,
  });
};

const getCompanies = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const companies = await Company.find()
    .limit(limit)
    .skip((page - 1) * limit);
  const totalCompanies = await Company.countDocuments();

  return res.status(200).json({
    success: true,
    companies,
    totalResults: totalCompanies,
    page,
    totalPages: Math.ceil(totalCompanies / limit),
  });
};

const getCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  return res.status(200).json({ success: true, company });
};

const updateCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (req.body.address) {
    company.address = req.body.address;
  }
  if (req.body.email) {
    company.email = req.body.email;
  }
  if (req.body.phone) {
    company.phone = req.body.phone;
  }
  if (req.body.gstin) {
    company.gstin = req.body.gstin;
  }
  if (req.body.branch) {
    company.branch = req.body.branch;
  }

  if (req.files) {
    const { logo } = req.files;
    if (logo) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          logo[0].path,
          { folder: `${company.licenseKey}/companyData` }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload company logo to cloud.",
            error: cloudinaryResponse.error,
          });
        }
        company.logo = cloudinaryResponse.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload company logo to cloud.",
          error: error.message,
        });
      }
    }
  }

  await company.save();

  const user = await User.findOne({ company: company._id }).populate("company").lean();
  return res.status(200).json({ message: "Company updated successfully", user });
};

const deleteCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  await company.remove();

  return res.status(200).json({ message: "Company deleted successfully" });
};

const activateCompany = async (req, res) => {
  const { subscription, endDate } = req.body;

  const company = await Company.findById(req.params.id);
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }
  company.subscription = subscription;
  company.subscriptionStartDate = new Date();
  company.subscriptionEndDate = endDate;

  await company.save();

  return res.status(200).json({ message: "Company activated successfully" });
};

module.exports = {
  addCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  activateCompany,
};
