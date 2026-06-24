const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controller/uploadController");

router.post("/image", uploadImage);

module.exports = router;
