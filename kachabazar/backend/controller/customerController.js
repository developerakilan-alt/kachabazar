require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Otp = require("../models/Otp");
const {
  tokenForVerify,
  generateAccessToken,
  generateRefreshToken,
} = require("../config/auth");
const { sendEmail } = require("../lib/email-sender/sender");
const {
  customerRegisterBody,
} = require("../lib/email-sender/templates/register");
const {
  forgetPasswordEmailBody,
} = require("../lib/email-sender/templates/forget-password");
const { emailOtpBody } = require("../lib/email-sender/templates/email-otp");
const { sendVerificationCode } = require("../lib/phone-verification/sender");
const { getSettings } = require("../lib/settings-cache");

const verifyEmailAddress = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (isAdded) {
    return res.status(403).send({
      message: "This Email already Added!",
    });
  } else {
    const token = tokenForVerify(req.body);
    const option = {
      name: req.body.name,
      email: req.body.email,
      token: token,
    };
    const cfg = await getSettings();
    const body = {
      from: cfg.email_user,
      to: `${req.body.email}`,
      subject: "Verify Your Email",
      html: customerRegisterBody({ ...option, store_url: cfg.store_url }),
    };

    const message = "Please check your email to verify your account!";
    sendEmail(body, res, message);
  }
};

const verifyPhoneNumber = async (req, res) => {
  const { phone, name, password } = req.body;

  // Check if phone number is provided
  if (!phone) {
    return res.status(400).send({
      message: "Phone number is required.",
    });
  }

  // Validate phone number format (international format with + prefix)
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({
      message: "Invalid phone number format. Please include country code.",
    });
  }

  try {
    // Generate a secure random 6-digit verification code
    const verificationCode = Otp.generateCode(6);

    // Store OTP in database with user data for registration
    const userData =
      name && password
        ? {
            name,
            password: bcrypt.hashSync(password, 10),
          }
        : undefined;

    // Store OTP with hashing enabled for security
    await Otp.createOtp({
      identifier: phone,
      type: "phone",
      code: verificationCode,
      userData,
      expiresInMinutes: 10,
      hashCode: true, // Hash the OTP for secure storage
    });

    // Send verification code via SMS
    const sent = await sendVerificationCode(phone, verificationCode);

    if (!sent.success) {
      console.error("SMS sending failed:", sent);
      return res.status(500).send({
        message:
          sent.error || "Failed to send verification code. Please try again.",
        code: sent.code,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("OTP sent successfully to:", phone);
    }

    const response = {
      message: "Verification code sent! Please check your phone.",
      expiresIn: 600, // 10 minutes in seconds
    };

    // In development, include OTP in response for testing
    if (process.env.NODE_ENV !== "production") {
      response.otp = verificationCode;
    }

    return res.send(response);
  } catch (err) {
    console.error("Error during phone verification:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Verify OTP and register user with phone number
const confirmPhoneOtp = async (req, res) => {
  const { phone, code, name, password } = req.body;

  if (!phone || !code) {
    return res.status(400).send({
      message: "Phone number and verification code are required.",
    });
  }

  try {
    // Verify the OTP (with hashed comparison)
    const result = await Otp.verifyOtp({
      identifier: phone,
      type: "phone",
      code: code.toString(),
      isHashed: true, // OTP is stored hashed
    });

    if (!result.success) {
      return res.status(400).send({
        message: result.error,
      });
    }

    // Check if user already exists
    const existingUser = await Customer.findOne({ phone });
    if (existingUser) {
      // User exists, log them in
      const accessToken = generateAccessToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);

      // Delete the OTP record after successful verification
      await Otp.deleteOne({ identifier: phone, type: "phone" });

      return res.send({
        refreshToken,
        token: accessToken,
        expiresIn: 900,
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        image: existingUser.image,
        address: existingUser.address,
        city: existingUser.city,
        country: existingUser.country,
        message: "Phone verified and logged in successfully!",
      });
    }

    // Get user data from OTP record or request body
    const userData = result.otp.userData || {};
    const userName = name || userData.name || `User-${phone.slice(-4)}`;
    const userPassword = password
      ? bcrypt.hashSync(password, 10)
      : userData.password;

    // Create new user
    const newUser = new Customer({
      name: userName,
      phone,
      password: userPassword,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Delete the OTP record
    await Otp.deleteOne({ identifier: phone, type: "phone" });

    return res.send({
      refreshToken,
      token: accessToken,
      expiresIn: 900,
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      message: "Phone verified and registered successfully!",
    });
  } catch (err) {
    console.error("Error during OTP confirmation:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Send email OTP for verification (alternative to link-based verification)
const sendEmailOtp = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required.",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({
      message: "Invalid email format.",
    });
  }

  try {
    // Generate a secure random 6-digit verification code
    const verificationCode = Otp.generateCode(6);

    // Store OTP in database with user data for registration
    const userData =
      name && password
        ? {
            name,
            email,
            password: bcrypt.hashSync(password, 10),
          }
        : undefined;

    await Otp.createOtp({
      identifier: email,
      type: "email",
      code: verificationCode,
      userData,
      expiresInMinutes: 10,
      hashCode: true,
    });

    // Send OTP via email
    const cfg = await getSettings();
    const emailBody = {
      from: cfg.email_user,
      to: email,
      subject: `Verify Your Email - ${cfg.app_name || "KachaBazar"}`,
      html: emailOtpBody({
        name: name || "User",
        email,
        code: verificationCode,
      }),
    };

    sendEmail(
      emailBody,
      res,
      "Verification code sent! Please check your email.",
    );
  } catch (err) {
    console.error("Error sending email OTP:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Verify email OTP and register user
const confirmEmailOtp = async (req, res) => {
  const { email, code, name, password } = req.body;

  if (!email || !code) {
    return res.status(400).send({
      message: "Email and verification code are required.",
    });
  }

  try {
    // Verify the OTP (with hashed comparison)
    const result = await Otp.verifyOtp({
      identifier: email,
      type: "email",
      code: code.toString(),
      isHashed: true,
    });

    if (!result.success) {
      return res.status(400).send({
        message: result.error,
      });
    }

    // Check if user already exists
    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      // User exists, log them in
      const accessToken = generateAccessToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);

      // Delete the OTP record
      await Otp.deleteOne({ identifier: email, type: "email" });

      return res.send({
        refreshToken,
        token: accessToken,
        expiresIn: 900,
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        image: existingUser.image,
        address: existingUser.address,
        city: existingUser.city,
        country: existingUser.country,
        message: "Email verified and logged in successfully!",
      });
    }

    // Get user data from OTP record or request body
    const userData = result.otp.userData || {};
    const userName = name || userData.name || email.split("@")[0];
    const userEmail = email || userData.email;
    const userPassword = password
      ? bcrypt.hashSync(password, 10)
      : userData.password;

    if (!userName) {
      return res.status(400).send({
        message: "Name is required for registration.",
      });
    }

    // Create new user
    const newUser = new Customer({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Delete the OTP record
    await Otp.deleteOne({ identifier: email, type: "email" });

    return res.send({
      refreshToken,
      token: accessToken,
      expiresIn: 900,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      message: "Email verified and registered successfully!",
    });
  } catch (err) {
    console.error("Error during email OTP confirmation:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Resend email OTP
const resendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required.",
    });
  }

  try {
    // Check if there's an existing OTP that hasn't expired
    const existingOtp = await Otp.findOne({
      identifier: email,
      type: "email",
      expiresAt: { $gt: new Date() },
    });

    // Rate limiting: Check if OTP was created less than 60 seconds ago
    if (existingOtp) {
      const timeSinceCreation = Date.now() - existingOtp.createdAt.getTime();
      const cooldownPeriod = 60 * 1000; // 60 seconds

      if (timeSinceCreation < cooldownPeriod) {
        const remainingSeconds = Math.ceil(
          (cooldownPeriod - timeSinceCreation) / 1000,
        );
        return res.status(429).send({
          message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
          retryAfter: remainingSeconds,
        });
      }
    }

    // Generate a secure random 6-digit verification code
    const verificationCode = Otp.generateCode(6);

    // Store or update OTP in database (preserving user data if exists)
    await Otp.createOtp({
      identifier: email,
      type: "email",
      code: verificationCode,
      userData: existingOtp?.userData,
      expiresInMinutes: 10,
      hashCode: true,
    });

    // Send OTP via email
    const cfg2 = await getSettings();
    const emailBody = {
      from: cfg2.email_user,
      to: email,
      subject: `Verify Your Email - ${cfg2.app_name || "KachaBazar"}`,
      html: emailOtpBody({
        name: existingOtp?.userData?.name || "User",
        email,
        code: verificationCode,
      }),
    };

    sendEmail(emailBody, res, "New verification code sent!");
  } catch (err) {
    console.error("Error resending email OTP:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

// Resend OTP for phone verification
const resendPhoneOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send({
      message: "Phone number is required.",
    });
  }

  try {
    // Check if there's an existing OTP that hasn't expired
    const existingOtp = await Otp.findOne({
      identifier: phone,
      type: "phone",
      expiresAt: { $gt: new Date() },
    });

    // Rate limiting: Check if OTP was created less than 60 seconds ago
    if (existingOtp) {
      const timeSinceCreation = Date.now() - existingOtp.createdAt.getTime();
      const cooldownPeriod = 60 * 1000; // 60 seconds

      if (timeSinceCreation < cooldownPeriod) {
        const remainingSeconds = Math.ceil(
          (cooldownPeriod - timeSinceCreation) / 1000,
        );
        return res.status(429).send({
          message: `Please wait ${remainingSeconds} seconds before requesting a new code.`,
          retryAfter: remainingSeconds,
        });
      }
    }

    // Generate a secure random 6-digit verification code
    const verificationCode = Otp.generateCode(6);

    // Store or update OTP in database (preserving user data if exists)
    await Otp.createOtp({
      identifier: phone,
      type: "phone",
      code: verificationCode,
      userData: existingOtp?.userData,
      expiresInMinutes: 10,
      hashCode: true, // Hash the OTP for secure storage
    });

    // Send verification code via SMS
    const sent = await sendVerificationCode(phone, verificationCode);

    if (!sent) {
      return res.status(500).send({
        message: "Failed to send verification code. Please try again.",
      });
    }

    const response = {
      message: "New verification code sent!",
      expiresIn: 600,
    };

    // In development, include OTP in response for testing
    if (process.env.NODE_ENV !== "production") {
      response.otp = verificationCode;
    }

    return res.send(response);
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const registerCustomer = async (req, res) => {
  const token = req.params.token;

  try {
    const { name, email, password } = jwt.decode(token);

    // Check if the user is already registered
    const isAdded = await Customer.findOne({ email });

    if (isAdded) {
      const accessToken = generateAccessToken(isAdded);
      const refreshToken = generateRefreshToken(isAdded);
      await isAdded.save();

      return res.send({
        refreshToken,
        token: accessToken,
        _id: isAdded._id,
        name: isAdded.name,
        email: isAdded.email,
        password: password,
        message: "Email Already Verified!",
      });
    }

    if (token) {
      try {
        const decoded = await jwt.verify(
          token,
          process.env.JWT_SECRET_FOR_VERIFY,
        );

        // Create a new user only if not already registered
        const existingUser = await Customer.findOne({ email });
        // existingUser found — log in

        if (existingUser) {
          return res.status(400).send({ message: "User already exists!" });
        } else {
          const newUser = new Customer({
            name,
            email,
            password: bcrypt.hashSync(password),
          });

          await newUser.save();
          const accessToken = generateAccessToken(newUser);
          const refreshToken = generateRefreshToken(newUser);
          await newUser.save();
          res.send({
            refreshToken,
            token: accessToken,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            message: "Email Verified, Please Login Now!",
          });
        }
      } catch (err) {
        return res.status(401).send({
          message: "Token Expired, Please try again!",
        });
      }
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({
      message: "Internal server error. Please try again later.",
    });
  }
};

const addAllCustomers = async (req, res) => {
  try {
    // SAFETY: Block in production — this endpoint deletes ALL customers
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send({
        message:
          "Bulk customer replacement is disabled in production. Use individual endpoints instead.",
      });
    }
    await Customer.deleteMany();
    await Customer.insertMany(req.body);
    res.send({
      message: "Added all users successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.body.email });

    // console.log("loginCustomer", req.body.password, "customer", customer);

    if (
      customer &&
      customer.password &&
      bcrypt.compareSync(req.body.password, customer.password)
    ) {
      const accessToken = generateAccessToken(customer);
      const refreshToken = generateRefreshToken(customer);
      await customer.save();

      res.send({
        refreshToken,
        token: accessToken,
        expiresIn: 900,
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
        image: customer.image,
        city: customer.city,
        country: customer.country,
      });
    } else {
      res.status(401).send({
        message: "Invalid user or password!",
        error: "Invalid user or password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
      error: "Invalid user or password!",
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await Customer.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    // (Optional) check against DB if you store refresh tokens
    // if (user.refreshToken !== refreshToken) {
    //   return res.status(401).json({ message: "Invalid refresh token" });
    // }

    // Issue new access token
    const accessToken = generateAccessToken(user);

    res.json({
      accessToken,
      expiresIn: 900, // 15 min
      refreshToken, // reuse old, or generateRefreshToken(user) for rotation
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

const forgetPassword = async (req, res) => {
  const isAdded = await Customer.findOne({ email: req.body.email });
  if (!isAdded) {
    return res.status(404).send({
      message: "User Not found with this email!",
    });
  } else {
    const token = tokenForVerify(isAdded);
    const option = {
      name: isAdded.name,
      email: isAdded.email,
      token: token,
    };

    const cfg = await getSettings();
    const body = {
      from: cfg.email_user,
      to: `${req.body.email}`,
      subject: "Password Reset",
      html: forgetPasswordEmailBody({ ...option, store_url: cfg.store_url }),
    };

    const message = "Please check your email to reset password!";
    sendEmail(body, res, message);
  }
};

const resetPassword = async (req, res) => {
  const token = req.body.token;

  try {
    const { email } = jwt.decode(token);
    const customer = await Customer.findOne({ email: email });

    if (!customer) {
      return res.status(404).send({
        message: "Customer not found!",
      });
    }

    if (token) {
      try {
        const decoded = await jwt.verify(
          token,
          process.env.JWT_SECRET_FOR_VERIFY,
        );
        customer.password = bcrypt.hashSync(req.body.newPassword);
        await customer.save();
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

const changePassword = async (req, res) => {
  try {
    // console.log("changePassword", req.body);
    const customer = await Customer.findOne({ email: req.body.email });
    if (!customer.password) {
      return res.status(403).send({
        message:
          "For change password,You need to sign up with email & password!",
      });
    } else if (
      customer &&
      bcrypt.compareSync(req.body.currentPassword, customer.password)
    ) {
      customer.password = bcrypt.hashSync(req.body.newPassword);
      await customer.save();
      res.send({
        message: "Your password change successfully!",
      });
    } else {
      res.status(401).send({
        message: "Invalid email or current password!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const signUpWithOauthProvider = async (req, res) => {
  try {
    const isAdded = await Customer.findOne({ email: req.body.email });
    let user;

    if (isAdded) {
      user = isAdded;
    } else {
      user = new Customer({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image,
      });
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.save();

    res.send({
      refreshToken,
      token: accessToken,
      expiresIn: 900,
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      address: user.address,
      phone: user.phone,
      city: user.city,
      country: user.country,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { page, limit, search, searchText, sortBy, sortOrder } = req.query;

    // Legacy support: if searchText provided without page/limit
    const searchTerm = search || searchText || "";

    // If no page/limit, return all (legacy behavior)
    if (!page && !limit) {
      const queryObject = {};
      if (searchTerm) {
        queryObject.$or = [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ];
      }
      const users = await Customer.find(queryObject).sort({ _id: -1 });
      return res.send(users);
    }

    // Server-side paginated query for admin
    const queryObject = {};

    if (searchTerm) {
      queryObject.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Sorting
    let sortObject = { _id: -1 };
    if (sortBy) {
      sortObject = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
    }

    const pages = Number(page) || 1;
    const limits = Number(limit) || 20;
    const skip = (pages - 1) * limits;

    const totalDoc = await Customer.countDocuments(queryObject);
    const customers = await Customer.find(queryObject)
      .select("-password")
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      customers,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Shipping address create or update
const addShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    const newShippingAddress = req.body;

    // console.log("customerId", customerId);

    // Find the customer by ID and update the shippingAddress field
    const result = await Customer.updateOne(
      { _id: customerId },
      {
        $set: {
          shippingAddress: newShippingAddress,
        },
      },
      { upsert: true }, // Create a new document if no document matches the filter
    );

    // console.log("result", result);

    if (result.modifiedCount > 0) {
      return res.send({
        message: "Shipping address added or updated successfully.",
      });
    } else {
      return res.status(404).send({ message: "Customer not found." });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const customerId = req.params.id;
    // const addressId = req.query.id;

    // console.log("getShippingAddress", customerId);
    // console.log("addressId", req.query);

    const customer = await Customer.findById(customerId);
    res.send({ shippingAddress: customer?.shippingAddress });

    // if (addressId) {
    //   // Find the specific address by its ID
    //   const address = customer.shippingAddress.find(
    //     (addr) => addr._id.toString() === addressId.toString()
    //   );

    //   if (!address) {
    //     return res.status(404).send({
    //       message: "Shipping address not found!",
    //     });
    //   }

    //   return res.send({ shippingAddress: address });
    // } else {
    //   res.send({ shippingAddress: customer?.shippingAddress });
    // }
  } catch (err) {
    // console.error("Error adding shipping address:", err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;

    const Customer = activeDB.model("Customer", CustomerModel);
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      customer.shippingAddress.push(req.body);

      await customer.save();
      res.send({ message: "Success" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteShippingAddress = async (req, res) => {
  try {
    const activeDB = req.activeDB;
    const { userId, shippingId } = req.params;

    const Customer = activeDB.model("Customer", CustomerModel);
    await Customer.updateOne(
      { _id: userId },
      {
        $pull: {
          shippingAddress: { _id: shippingId },
        },
      },
    );

    res.send({ message: "Shipping Address Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, email, address, phone, image } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send({ message: "Customer not found!" });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (
      existingCustomer &&
      existingCustomer._id.toString() !== customer._id.toString()
    ) {
      return res.status(400).send({ message: "Email already exists." });
    }

    customer.name = name;
    customer.email = email;
    customer.address = address;
    customer.phone = phone;
    customer.image = image;
    customer.city = req.body.city;
    customer.country = req.body.country;

    await customer.save();

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);
    await customer.save();

    res.send({
      refreshToken,
      token: accessToken,
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
      image: customer.image,
      city: customer.city,
      country: customer.country,
      message: "Customer updated successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "User Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyCustomers = async (req, res) => {
  try {
    const { ids } = req.body;
    await Customer.deleteMany({ _id: { $in: ids } });
    res.status(200).send({
      message: "Users Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  loginCustomer,
  refreshToken,
  verifyPhoneNumber,
  confirmPhoneOtp,
  resendPhoneOtp,
  sendEmailOtp,
  confirmEmailOtp,
  resendEmailOtp,
  registerCustomer,
  addAllCustomers,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  deleteManyCustomers,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
};
