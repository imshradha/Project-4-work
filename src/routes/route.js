const express = require('express');
const router = express.Router();
const urlcontroller = require("../controllers/urlController")

//api's
//create url
router.post('/url/shorten', urlcontroller.createUrl)

//get url
router.get('/:urlCode', urlcontroller.getUrlCode)

//export router
module.exports = router;