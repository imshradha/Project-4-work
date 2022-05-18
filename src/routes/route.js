const express = require('express');
const router = express.Router();
const urlcontroller = require("../controllers/urlController")

//api's
//create url
router.post('/url/shorten', urlcontroller.createUrl)

<<<<<<< HEAD
router.post('/shorten', urlcontroller.generateShortUrl)
=======
//get url
>>>>>>> 2b9b387e9593b237843f65d5ea1697de098414f5
router.get('/:urlCode', urlcontroller.getUrlCode)

//export router
module.exports = router;