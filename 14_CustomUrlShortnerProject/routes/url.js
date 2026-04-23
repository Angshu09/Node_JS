const express = require("express");
const router = express.Router();
const { handleGenerateNewShortUrl, handleShortUrlAnalytics } = require("../controllers/url");

router.post("/", handleGenerateNewShortUrl);
router.get("/analytics/:shortId", handleShortUrlAnalytics)

module.exports = router;
