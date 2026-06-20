//models
const Setting = require("../models/Setting");
const {
  encryptSensitiveFields,
  invalidateSettingsCache,
} = require("../lib/settings-cache");

//global setting controller
const addGlobalSetting = async (req, res) => {
  try {
    // Encrypt sensitive fields before saving
    const body = { ...req.body };
    if (body.setting) {
      body.setting = encryptSensitiveFields(body.setting);
    }
    const newGlobalSetting = new Setting(body);
    await newGlobalSetting.save();
    invalidateSettingsCache();
    res.send({
      message: "Global Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getGlobalSetting = async (req, res) => {
  try {
    const globalSetting = await Setting.findOne({ name: "globalSetting" });
    if (!globalSetting || !globalSetting.setting) {
      return res.send({
        default_currency: "₹",
        default_language: "en",
      });
    }

    // Decrypt sensitive fields before sending to the admin panel
    const { decryptSensitiveFields } = require("../lib/settings-cache");
    const decrypted = decryptSensitiveFields(
      globalSetting.setting.toObject
        ? globalSetting.setting.toObject()
        : { ...globalSetting.setting },
    );

    // Mask passwords/keys for security — only show last 4 chars
    const masked = { ...decrypted };
    const SENSITIVE_FIELDS = require("../lib/settings-cache").SENSITIVE_FIELDS;
    for (const field of SENSITIVE_FIELDS) {
      if (masked[field] && masked[field].length > 4) {
        masked[field] =
          "•".repeat(masked[field].length - 4) + masked[field].slice(-4);
      }
    }

    // If admin requests full (unmasked) data for form pre-fill
    if (req.query.raw === "true") {
      return res.send(decrypted);
    }

    res.send(masked);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateGlobalSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Encrypt sensitive fields before saving
    const encryptedSetting = encryptSensitiveFields(setting);

    // Construct the $set object dynamically
    const setObject = Object.keys(encryptedSetting).reduce((acc, key) => {
      acc[`setting.${key}`] = encryptedSetting[key];
      return acc;
    }, {});

    const globalSetting = await Setting.findOneAndUpdate(
      { name: "globalSetting" },
      { $set: setObject },
      { new: true, upsert: true },
    );

    // Invalidate the in-memory settings cache so next read picks up changes
    invalidateSettingsCache();

    res.send({
      data: globalSetting,
      message: "Global Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//store setting controller
const addStoreSetting = async (req, res) => {
  try {
    const newStoreSetting = new Setting(req.body);
    await newStoreSetting.save();
    res.send({
      message: "Store Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStoreSetting = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    // console.log("storeSetting", req.query);

    if (!storeSetting) {
      return res.status(404).send({ message: "Store setting not found!" });
    }
    if (req.query.filter === "all") {
      return res.send(storeSetting.setting);
    }

    const {
      cod_status,
      fb_pixel_key,
      fb_pixel_status,
      google_analytic_key,
      google_analytic_status,
      google_login_status,
      meta_url,
      razorpay_id,
      razorpay_status,
      stripe_key,
      stripe_status,
      tawk_chat_property_id,
      tawk_chat_status,
      tawk_chat_widget_id,
      facebook_login_status,
      github_login_status,
    } = storeSetting.setting;
    const isPlaceholder = (value = "") =>
      value.includes("YourTestKeyHere") || value.includes("YourTestSecretHere");
    const publicRazorpayId =
      !isPlaceholder(razorpay_id) ? razorpay_id : undefined;

    res.send({
      cod_status,
      fb_pixel_key,
      fb_pixel_status,
      google_analytic_key,
      google_analytic_status,
      google_login_status,
      meta_url,
      razorpay_id: publicRazorpayId,
      razorpay_status: razorpay_status || Boolean(publicRazorpayId),
      stripe_key,
      stripe_status,
      tawk_chat_property_id,
      tawk_chat_status,
      tawk_chat_widget_id,
      facebook_login_status,
      github_login_status,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getStoreSecretKeys = async (req, res) => {
  try {
    const storeSetting = await Setting.findOne({ name: "storeSetting" });

    if (!storeSetting) {
      return res.status(404).send({ message: "Store setting not found!" });
    }

    const {
      google_id,
      google_secret,
      facebook_id,
      facebook_secret,
      github_id,
      github_secret,
      razorpay_id,
      razorpay_secret,
      stripe_secret,
      nextauth_secret,
    } = storeSetting.setting;
    const isPlaceholder = (value = "") =>
      value.includes("YourTestKeyHere") || value.includes("YourTestSecretHere");
    const resolvedRazorpayId =
      !isPlaceholder(razorpay_id) ? razorpay_id : undefined;
    const resolvedRazorpaySecret =
      (!isPlaceholder(razorpay_secret) ? razorpay_secret : undefined);

    res.send({
      google_id,
      google_secret,
      facebook_id,
      facebook_secret,
      github_id,
      github_secret,
      razorpay_id: resolvedRazorpayId,
      razorpay_secret: resolvedRazorpaySecret,
      stripe_secret,
      nextauth_secret,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateStoreSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Dynamically build the update fields
    const updateFields = Object.keys(setting).reduce((acc, key) => {
      acc[`setting.${key}`] = setting[key];
      return acc;
    }, {});
    // Update the online store setting document
    const storeSetting = await Setting.findOneAndUpdate(
      { name: "storeSetting" },
      { $set: updateFields },
      { new: true, upsert: true }, // upsert to create the document if it doesn't exist
    );

    res.send({
      data: storeSetting,
      message: "Store Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

//online store customization controller
const addStoreCustomizationSetting = async (req, res) => {
  try {
    const newStoreCustomizationSetting = new Setting(req.body);
    const storeCustomizationSetting = await newStoreCustomizationSetting.save();

    res.send({
      data: storeCustomizationSetting,
      message: "Online Store Customization Setting Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getStoreCustomizationSetting = async (req, res) => {
  try {
    // const { key, keyTwo } = req.query;
    // console.log("getStoreCustomizationSetting");

    // console.log("req query", req.query, "key", key, "keyTwo", keyTwo);

    // let projection = {};
    // if (key) {
    //   projection[`setting.${key}`] = 1;
    // }
    // if (keyTwo) {
    //   projection[`setting.${keyTwo}`] = 1;
    // }

    // // If neither key nor keyTwo is provided, fetch all settings
    // if (!key && !keyTwo) {
    //   projection = { setting: 1 };
    // }

    const storeCustomizationSetting = await Setting.findOne(
      { name: "storeCustomizationSetting" },
      // projection
    );

    if (!storeCustomizationSetting) {
      return res.status(404).send({ message: "Settings not found" });
    }

    res.send(storeCustomizationSetting.setting);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const getStoreSeoSetting = async (req, res) => {
  // console.log("getStoreSeoSetting");
  try {
    const storeCustomizationSetting = await Setting.findOne(
      {
        name: "storeCustomizationSetting",
      },
      { "setting.seo": 1, _id: 0 },
    );
    // console.log("storeCustomizationSetting", storeCustomizationSetting);
    res.send(storeCustomizationSetting?.setting);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStoreCustomizationSetting = async (req, res) => {
  try {
    const { setting } = req.body;

    // Dynamically build the update fields
    const updateFields = Object.keys(setting).reduce((acc, key) => {
      acc[`setting.${key}`] = setting[key];
      return acc;
    }, {});
    // Update the online store setting document
    const storeCustomizationSetting = await Setting.findOneAndUpdate(
      { name: "storeCustomizationSetting" },
      { $set: updateFields },
      { new: true, upsert: true }, // upsert to create the document if it doesn't exist
    );

    res.send({
      data: storeCustomizationSetting,
      message: "Online Store Customization Setting Update Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
  addStoreSetting,
  getStoreSetting,
  getStoreSecretKeys,
  updateStoreSetting,
  getStoreSeoSetting,
  addStoreCustomizationSetting,
  getStoreCustomizationSetting,
  updateStoreCustomizationSetting,
};
