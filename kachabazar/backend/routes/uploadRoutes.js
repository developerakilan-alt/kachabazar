const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controller/uploadController");
const { isAuth, isAdmin } = require("../config/auth");

router.post("/image", isAuth, isAdmin, uploadImage);

module.exports = router;
