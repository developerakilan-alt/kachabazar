const Notification = require("../models/Notification");

const addNotification = async (req, res) => {
  // console.log("addNotification", req.body);

  try {
    if (req.body.productId) {
      const isAdded = await Notification.findOne({
        productId: req.body.productId,
      });
      if (isAdded) {
        return res.end();
      } else {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.status(200).send({
          message: "Notification save successfully!",
        });
      }
    } else {
      const newNotification = new Notification(req.body);
      await newNotification.save();
      res.status(200).send({
        message: "Notification save successfully!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllNotification = async (req, res) => {
  try {
    const { page, limit, search, status, sortBy, sortOrder } = req.query;

    const queryObject = { status: { $in: ["read", "unread"] } };

    if (search) {
      queryObject.message = { $regex: search, $options: "i" };
    }

    if (status && (status === "read" || status === "unread")) {
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

    const totalDoc = await Notification.countDocuments(queryObject);
    const totalUnreadDoc = await Notification.countDocuments({
      status: "unread",
    });
    const notifications = await Notification.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({ totalDoc, totalUnreadDoc, notifications, limits, pages });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateStatusNotification = async (req, res) => {
  try {
    const newStatus = req.body.status;

    await Notification.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      },
    );
    const totalDoc = await Notification.countDocuments({ status: "unread" });

    res.send({
      totalDoc,
      message: `Notification Read!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateManyStatusNotification = async (req, res) => {
  try {
    await Notification.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        multi: true,
      },
    );

    res.send({
      message: "Notification update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteNotificationById = async (req, res) => {
  try {
    Notification.deleteOne({ _id: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.send({
          message: "Notification deleted successfully!",
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteNotificationByProductId = async (req, res) => {
  try {
    Notification.deleteOne({ productId: req.params.id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.send({
          message: "Notification deleted successfully!",
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Notification Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getAllNotification,
  addNotification,
  updateStatusNotification,
  deleteNotificationById,
  deleteNotificationByProductId,
  updateManyStatusNotification,
  deleteManyNotification,
};
