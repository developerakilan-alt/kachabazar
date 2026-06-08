const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

// const { mongo_connection } = require('../config/db'); // CCDev
const Coupon = require("../models/Coupon");

const addCoupon = async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.send({ message: "Coupon Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addAllCoupon = async (req, res) => {
  try {
    // SAFETY: Block in production — this endpoint deletes ALL coupons
    if (process.env.NODE_ENV === "production") {
      return res.status(403).send({
        message:
          "Bulk coupon replacement is disabled in production. Use individual add/update endpoints instead.",
      });
    }
    await Coupon.deleteMany();
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: "Coupon Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const { status, page, limit, search, sortBy, sortOrder, couponStatus } =
      req.query;

    const queryObject = {};

    if (status) {
      queryObject.status = { $regex: `${status}`, $options: "i" };
    }

    // Filter by coupon active/expired status based on endTime
    if (couponStatus === "active") {
      queryObject.endTime = { $gte: new Date() };
    } else if (couponStatus === "expired") {
      queryObject.endTime = { $lt: new Date() };
    }

    // If no page/limit provided, return all (legacy behavior)
    if (!page && !limit) {
      const coupons = await Coupon.find(queryObject).sort({ _id: -1 });
      return res.send(coupons);
    }

    // Search across title (multilingual Object), couponCode
    if (search) {
      const { languageCodes } = require("../utils/data");
      const titleQueries = languageCodes.map((lang) => ({
        [`title.${lang}`]: { $regex: search, $options: "i" },
      }));
      queryObject.$or = [
        ...titleQueries,
        { couponCode: { $regex: search, $options: "i" } },
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

    const totalDoc = await Coupon.countDocuments(queryObject);
    const coupons = await Coupon.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      coupons,
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

const getShowingCoupons = async (req, res) => {
  // console.log("getShowingCoupons");
  try {
    const coupons = await Coupon.find({
      status: "show",
    }).sort({ _id: -1 });
    res.send(coupons);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const verifyCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      couponCode: req.params.couponCode,
      status: "show",
    });

    if (!coupon) {
      return res.status(404).send({
        message: "Coupon not found or inactive!",
      });
    }

    // Check if coupon has expired
    if (coupon.endTime && new Date(coupon.endTime) < new Date()) {
      return res.status(400).send({
        message: "This coupon has expired!",
      });
    }

    res.send(coupon);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.title = { ...coupon.title, ...req.body.title };
      // coupon.title[req.body.lang] = req.body.title;
      // coupon.title = req.body.title;
      coupon.couponCode = req.body.couponCode;
      coupon.endTime = dayjs().utc().format(req.body.endTime);
      // coupon.discountPercentage = req.body.discountPercentage;
      coupon.minimumAmount = req.body.minimumAmount;
      coupon.productType = req.body.productType;
      coupon.discountType = req.body.discountType;
      coupon.logo = req.body.logo;

      await coupon.save();
      res.send({ message: "Coupon Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send({ message: "Coupon not found!" });
  }
};

const updateManyCoupons = async (req, res) => {
  try {
    await Coupon.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
      },
      {
        multi: true,
      },
    );

    res.send({
      message: "Coupons update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Coupon.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    res.status(200).send({
      message: `Coupon ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    // console.log("deleteCoupon", req.params.id);

    await Coupon.deleteOne({ _id: req.params.id });
    res.status(200).send({
      message: "Coupon Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteManyCoupons = async (req, res) => {
  try {
    await Coupon.deleteMany({ _id: req.body.ids });
    res.send({
      message: `Coupons Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getShowingCoupons,
  getCouponById,
  verifyCoupon,
  updateCoupon,
  updateStatus,
  deleteCoupon,
  updateManyCoupons,
  deleteManyCoupons,
};
