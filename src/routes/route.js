const express = require('express');
const router = express.Router();
const urlcontroller = require("../controllers/urlController")


router.post('/shorten', urlcontroller.createUrl)

module.exports = router;