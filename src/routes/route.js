const express = require('express');
const router = express.Router();
const urlcontroller = require("../controllers/urlController")


router.post('/shorten', urlcontroller.generateShortUrl)
router.get('/:urlCode', urlcontroller.getUrlCode)

module.exports = router;