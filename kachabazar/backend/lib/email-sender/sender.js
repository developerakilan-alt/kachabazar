const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const { getSettings } = require("../settings-cache");

const sendEmail = async (body, res, message) => {
  try {
    const cfg = await getSettings();

    const transporter = nodemailer.createTransport({
      host: cfg.email_host,
      port: Number(cfg.email_port) || 465,
      secure: Number(cfg.email_port) === 465,
      auth: {
        user: cfg.email_user,
        pass: cfg.email_pass,
      },
    });

    // Use the configured email_user as "from" if body.from is not set
    if (!body.from) {
      body.from = cfg.email_user;
    }

    transporter.verify((err, success) => {
      if (err) {
        console.error("Verification error:", err);
        res.status(403).send({
          message: `Error during verification: ${err.message}`,
        });
      } else {
        console.log("Server is ready to take our messages");
        transporter.sendMail(body, (err, data) => {
          if (err) {
            console.error("Error sending email:", err);
            res.status(403).send({
              message: `Error sending email: ${err.message}`,
            });
          } else {
            console.log("email sent successfully!");

            res.send({
              message: message,
            });
          }
        });
      }
    });
  } catch (err) {
    console.error("Email setup error:", err);
    res.status(500).send({
      message: `Email service error: ${err.message}`,
    });
  }
};
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const phoneVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

// Separate limiter for OTP confirmation - higher limit since the OTP model
// already has its own brute-force protection (max 5 attempts per OTP)
const otpConfirmLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 20,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
  phoneVerificationLimit,
  otpConfirmLimit,
};
