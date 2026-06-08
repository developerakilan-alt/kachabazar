const bcrypt = require("bcryptjs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
const jwt = require("jsonwebtoken");
const {
  signInToken,
  tokenForVerify,
  handleEncryptData,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const Admin = require("../models/Admin");
const { getSettings } = require("../lib/settings-cache");

const registerAdmin = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(403).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password),
      });
      const staff = await newStaff.save();
      const token = signInToken(staff);
      res.send({
        token,
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        joiningData: Date.now(),
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin && bcrypt.compareSync(req.body.password, admin.password)) {
      if (admin?.status === "inactive") {
        return res.status(403).send({
          message:
            "Sorry, you don't have the access right now, please contact with Super Admin.",
        });
      }
      const token = signInToken(admin);

      const { data, iv } = handleEncryptData([
        ...admin?.access_list,
        admin.role,
      ]);
      res.send({
        token,
        _id: admin._id,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        image: admin.image,
        iv,
        data,
      });
    } else {
      res.status(401).send({
        message: "Invalid Email or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Admin.findOne({ email: req.body.verifyEmail });
  if (!isAdded) {
    return res.status(404).send({
      message: "Admin/Staff Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const cfg = await getSettings();
    const body = {
      from: cfg.email_user,
      to: `${req.body.verifyEmail}`,
      subject: "Password Reset",
      html: `<h2>Hello ${req.body.verifyEmail}</h2>
      <p>A request has been received to change the password for your <strong>${cfg.app_name || "hautecouturejewellery"}</strong> account </p>

        <p>This link will expire in <strong> 15 minute</strong>.</p>

        <p style="margin-bottom:20px;">Click this link for reset your password</p>

        <a href=${cfg.admin_url}/reset-password/${token}  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>

        
        <p style="margin-top: 35px;">If you did not initiate this request, please contact us immediately at support@hautecouturejewellery.com</p>

        <p style="margin-bottom:0px;">Thank you</p>
        <strong>${cfg.app_name || "hautecouturejewellery"} Team</strong>
             `,
    };
    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;

  try {
    const { email } = jwt.decode(token);
    const staff = await Admin.findOne({ email: email });

    if (!staff) {
      return res.status(404).send({
        message: "Admin/Staff not found!",
      });
    }

    if (token) {
      try {
        const decoded = await jwt.verify(
          token,
          process.env.JWT_SECRET_FOR_VERIFY,
        );
        staff.password = bcrypt.hashSync(req.body.newPassword);
        await staff.save();
        res.send({
          message: "Your password change successful, you can login now!",
        });
      } catch (err) {
        return res.status(500).send({
          message: "Token expired, please try again!",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const addStaff = async (req, res) => {
  try {
    const isAdded = await Admin.findOne({ email: req.body.email });
    if (isAdded) {
      return res.status(500).send({
        message: "This Email already Added!",
      });
    } else {
      const newStaff = new Admin({
        name: { ...req.body.name },
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        phone: req.body.phone,
        joiningDate: req.body.joiningDate,
        role: req.body.role,
        image: req.body.image,
        access_list: req.body.access_list,
      });
      await newStaff.save();
      res.status(200).send({
        message: "Staff Added Successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
    // console.log("error", err);
  }
};

const getAllStaff = async (req, res) => {
  try {
    const { page, limit, search, role, status, sortBy, sortOrder } = req.query;

    // If no page/limit, return all (legacy behavior)
    if (!page && !limit) {
      const admins = await Admin.find({}).sort({ _id: -1 });
      return res.send(admins);
    }

    // Server-side paginated query for admin
    const queryObject = {};

    if (search) {
      queryObject.$or = [
        { "name.en": { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      queryObject.role = role;
    }

    if (status) {
      queryObject.status = status;
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Admin.countDocuments(queryObject);
    const staff = await Admin.find(queryObject)
      .select("-password")
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      staff,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.send(admin);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStaff = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });

    if (admin) {
      admin.name = { ...admin.name, ...req.body.name };
      admin.email = req.body.email;
      admin.phone = req.body.phone;
      admin.role = req.body.role;
      admin.access_list = req.body.access_list;
      admin.joiningData = req.body.joiningDate;
      // admin.password =
      //   req.body.password !== undefined
      //     ? bcrypt.hashSync(req.body.password)
      //     : admin.password;

      admin.image = req.body.image;
      const updatedAdmin = await admin.save();
      const token = signInToken(updatedAdmin);

      const { data, iv } = handleEncryptData([
        ...updatedAdmin?.access_list,
        updatedAdmin.role,
      ]);
      res.send({
        token,
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        image: updatedAdmin.image,
        data,
        iv,
      });
    } else {
      res.status(404).send({
        message: "This Staff not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  try {
    // console.log("deleteCoupon", req.params.id);

    await Admin.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Admin Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updatedStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Admin.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    res.send({
      message: `Staff ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Assign role to a staff member
 * Only super admin can assign roles
 */
const assignRole = async (req, res) => {
  try {
    const { role, access_list } = req.body;
    const staffId = req.params.id;

    if (!role) {
      return res.status(400).send({
        message: "Role is required!",
      });
    }

    const staff = await Admin.findById(staffId);
    if (!staff) {
      return res.status(404).send({
        message: "Staff not found!",
      });
    }

    staff.role = role;
    if (access_list && Array.isArray(access_list)) {
      staff.access_list = access_list;
    }

    const updatedStaff = await staff.save();

    const { data, iv } = handleEncryptData([
      ...updatedStaff.access_list,
      updatedStaff.role,
    ]);

    res.status(200).send({
      message: `Role "${role}" assigned to ${
        typeof updatedStaff.name === "object"
          ? updatedStaff.name.en || Object.values(updatedStaff.name)[0]
          : updatedStaff.name
      } successfully!`,
      _id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
      role: updatedStaff.role,
      access_list: updatedStaff.access_list,
      data,
      iv,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

/**
 * Unassign role from a staff member (reset to default "cashier" role with empty access list)
 * Only super admin can unassign roles
 */
const unassignRole = async (req, res) => {
  try {
    const staffId = req.params.id;

    const staff = await Admin.findById(staffId);
    if (!staff) {
      return res.status(404).send({
        message: "Staff not found!",
      });
    }

    // Prevent unassigning from the last super admin
    if (staff.role === "super admin") {
      const superAdminCount = await Admin.countDocuments({
        role: "super admin",
        status: "active",
      });
      if (superAdminCount <= 1) {
        return res.status(400).send({
          message:
            "Cannot unassign the last super admin. At least one super admin must exist.",
        });
      }
    }

    const previousRole = staff.role;
    staff.role = "cashier";
    staff.access_list = [];

    const updatedStaff = await staff.save();

    const { data, iv } = handleEncryptData([
      ...updatedStaff.access_list,
      updatedStaff.role,
    ]);

    res.status(200).send({
      message: `Role "${previousRole}" has been unassigned from ${
        typeof updatedStaff.name === "object"
          ? updatedStaff.name.en || Object.values(updatedStaff.name)[0]
          : updatedStaff.name
      }. Default role "cashier" applied.`,
      _id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
      role: updatedStaff.role,
      access_list: updatedStaff.access_list,
      data,
      iv,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  assignRole,
  unassignRole,
};
