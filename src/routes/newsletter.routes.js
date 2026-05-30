const express = require("express");
const { subscribeNewsletter } = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);

module.exports = router;
