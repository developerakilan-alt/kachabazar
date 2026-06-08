/**
 * Production-ready SMS/Phone Verification Service
 * Supports multiple providers: Twilio, AWS SNS, MessageBird, Vonage
 *
 * All credentials are loaded from the database (globalSetting) via
 * the settings-cache module, with process.env as fallback.
 */

require("dotenv").config();
const { getSettings } = require("../settings-cache");

// Provider configurations
const PROVIDERS = {
  TWILIO: "twilio",
  AWS_SNS: "aws_sns",
  MESSAGEBIRD: "messagebird",
  VONAGE: "vonage",
  MOCK: "mock", // For development/testing
};

// Get the configured provider from settings (DB → env → default)
const getProvider = async () => {
  const cfg = await getSettings();
  return cfg.sms_provider || PROVIDERS.TWILIO;
};

// Twilio implementation
const sendViaTwilio = async (phoneNumber, message, cfg) => {
  const twilio = require("twilio");
  const accountSid = cfg.twilio_account_sid;
  const authToken = cfg.twilio_auth_token;
  const fromNumber = cfg.twilio_phone_number;
  const messagingServiceSid = cfg.twilio_messaging_service_sid;

  if (process.env.NODE_ENV !== "production") {
    console.log("Twilio Config Check:", {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasFromNumber: !!fromNumber,
      hasMessagingServiceSid: !!messagingServiceSid,
      toNumber: phoneNumber,
    });
  }

  if (!accountSid || !authToken || (!fromNumber && !messagingServiceSid)) {
    console.error(
      "Twilio credentials not configured. Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_PHONE_NUMBER or TWILIO_MESSAGING_SERVICE_SID",
    );
    return { success: false, error: "SMS service not configured" };
  }

  try {
    const client = new twilio(accountSid, authToken);

    // Build message options - use messagingServiceSid if available, otherwise use from number
    const messageOptions = {
      body: message,
      to: phoneNumber,
    };

    if (messagingServiceSid) {
      messageOptions.messagingServiceSid = messagingServiceSid;
    } else {
      messageOptions.from = fromNumber;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Sending SMS via Twilio to:", phoneNumber);
    }
    const result = await client.messages.create(messageOptions);
    if (process.env.NODE_ENV !== "production") {
      console.log("SMS sent successfully via Twilio:", {
        sid: result.sid,
        status: result.status,
        to: result.to,
      });
    }

    // Check message status after a short delay (Twilio may fail after accepting)
    // Note: 'accepted' doesn't mean delivered - we should track this
    if (result.status === "failed" || result.status === "undelivered") {
      return {
        success: false,
        error: `Message ${result.status}: ${
          result.errorMessage || "Unknown error"
        }`,
        code: result.errorCode,
      };
    }

    return { success: true, messageId: result.sid, status: result.status };
  } catch (error) {
    console.error("Twilio error details:", {
      message: error.message,
      code: error.code,
      moreInfo: error.moreInfo,
      status: error.status,
    });

    // Provide user-friendly error messages
    let userMessage = error.message;
    if (error.code === 21704) {
      userMessage =
        "SMS service is not configured for your region. Please contact support.";
    } else if (error.code === 21211) {
      userMessage = "Invalid phone number format.";
    } else if (error.code === 21608) {
      userMessage =
        "This phone number is not verified. Please use a verified number.";
    } else if (error.code === 21614) {
      userMessage = "Cannot send SMS to this phone number.";
    }

    return { success: false, error: userMessage, code: error.code };
  }
};

// AWS SNS implementation
const sendViaAwsSns = async (phoneNumber, message, cfg) => {
  const accessKeyId = cfg.aws_access_key_id;
  const secretAccessKey = cfg.aws_secret_access_key;

  if (!accessKeyId || !secretAccessKey) {
    console.error(
      "AWS credentials not configured. Required: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY",
    );
    return { success: false, error: "SMS service not configured" };
  }

  const AWS = require("aws-sdk");

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region: cfg.aws_region || "us-east-1",
  });

  const sns = new AWS.SNS();

  try {
    const result = await sns
      .publish({
        Message: message,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          "AWS.SNS.SMS.SenderID": {
            DataType: "String",
            StringValue: cfg.sms_sender_id || "KachaBazar",
          },
          "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional",
          },
        },
      })
      .promise();
    console.log("SMS sent via AWS SNS:", result.MessageId);
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error("AWS SNS error:", error.message);
    return { success: false, error: error.message };
  }
};

// MessageBird implementation
const sendViaMessageBird = async (phoneNumber, message, cfg) => {
  const apiKey = cfg.messagebird_api_key;

  if (!apiKey) {
    console.error(
      "MessageBird API key not configured. Required: MESSAGEBIRD_API_KEY",
    );
    return { success: false, error: "SMS service not configured" };
  }

  const messagebird = require("messagebird")(apiKey);

  return new Promise((resolve) => {
    const originator = cfg.sms_sender_id || "KachaBazar";

    console.log("MessageBird Config Check:", {
      hasApiKey: !!apiKey,
      originator,
      toNumber: phoneNumber,
    });

    messagebird.messages.create(
      {
        originator: originator.substring(0, 11), // MessageBird max 11 chars for alphanumeric
        recipients: [phoneNumber.replace("+", "")], // MessageBird expects numbers without +
        body: message,
      },
      (err, response) => {
        if (err) {
          console.error("MessageBird error details:", {
            message: err.message,
            errors: err.errors,
            statusCode: err.statusCode,
          });

          let userMessage = err.message;
          if (err.statusCode === 401) {
            userMessage = "SMS service authentication failed. Check API key.";
          } else if (err.statusCode === 422) {
            userMessage = "Invalid phone number or message format.";
          }

          resolve({ success: false, error: userMessage });
        } else {
          console.log("SMS sent via MessageBird:", {
            id: response.id,
            recipients: response.recipients?.totalCount,
            status: response.recipients?.items?.[0]?.status || "sent",
          });
          resolve({
            success: true,
            messageId: response.id,
            status: response.recipients?.items?.[0]?.status || "sent",
          });
        }
      },
    );
  });
};

// Vonage/Nexmo implementation
const sendViaVonage = async (phoneNumber, message, cfg) => {
  const apiKey = cfg.vonage_api_key;
  const apiSecret = cfg.vonage_api_secret;

  if (!apiKey || !apiSecret) {
    console.error(
      "Vonage credentials not configured. Required: VONAGE_API_KEY, VONAGE_API_SECRET",
    );
    return { success: false, error: "SMS service not configured" };
  }

  const { Vonage } = require("@vonage/server-sdk");

  const vonage = new Vonage({
    apiKey,
    apiSecret,
  });

  try {
    const result = await vonage.sms.send({
      to: phoneNumber.replace("+", ""),
      from: cfg.sms_sender_id || "KachaBazar",
      text: message,
    });
    console.log("SMS sent via Vonage:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Vonage error:", error.message);
    return { success: false, error: error.message };
  }
};

// Mock implementation for development
const sendViaMock = async (phoneNumber, message) => {
  console.log("=".repeat(50));
  console.log("MOCK SMS (Development Mode)");
  console.log("To:", phoneNumber);
  console.log("Message:", message);
  console.log("=".repeat(50));
  return { success: true, messageId: `mock_${Date.now()}` };
};

/**
 * Send verification code via SMS
 * @param {string} phoneNumber - Phone number with country code (e.g., +1234567890)
 * @param {string} verificationCode - The OTP code to send
 * @returns {Promise<{success: boolean, messageId?: string, error?: string, code?: number}>}
 */
const sendVerificationCode = async (phoneNumber, verificationCode) => {
  const cfg = await getSettings();
  const provider = cfg.sms_provider || PROVIDERS.TWILIO;
  const appName = cfg.app_name || "KachaBazar";
  const message = `Your ${appName} verification code is: ${verificationCode}. Valid for 10 minutes. Do not share this code with anyone.`;

  console.log(`Sending OTP via ${provider} to ${phoneNumber}`);

  let result;

  switch (provider) {
    case PROVIDERS.TWILIO:
      result = await sendViaTwilio(phoneNumber, message, cfg);
      break;
    case PROVIDERS.AWS_SNS:
      result = await sendViaAwsSns(phoneNumber, message, cfg);
      break;
    case PROVIDERS.MESSAGEBIRD:
      result = await sendViaMessageBird(phoneNumber, message, cfg);
      break;
    case PROVIDERS.VONAGE:
      result = await sendViaVonage(phoneNumber, message, cfg);
      break;
    case PROVIDERS.MOCK:
      result = await sendViaMock(phoneNumber, message);
      break;
    default:
      console.error(`Unknown SMS provider: ${provider}`);
      result = { success: false, error: "Unknown SMS provider" };
  }

  console.log(`SMS send result:`, result);
  return result;
};

/**
 * Send custom message via SMS
 * @param {string} phoneNumber - Phone number with country code
 * @param {string} message - Custom message to send
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendSms = async (phoneNumber, message) => {
  const cfg = await getSettings();
  const provider = cfg.sms_provider || PROVIDERS.TWILIO;

  switch (provider) {
    case PROVIDERS.TWILIO:
      return sendViaTwilio(phoneNumber, message, cfg);
    case PROVIDERS.AWS_SNS:
      return sendViaAwsSns(phoneNumber, message, cfg);
    case PROVIDERS.MESSAGEBIRD:
      return sendViaMessageBird(phoneNumber, message, cfg);
    case PROVIDERS.VONAGE:
      return sendViaVonage(phoneNumber, message, cfg);
    case PROVIDERS.MOCK:
      return sendViaMock(phoneNumber, message);
    default:
      return { success: false, error: "Unknown SMS provider" };
  }
};

module.exports = {
  sendVerificationCode,
  sendSms,
  PROVIDERS,
};
