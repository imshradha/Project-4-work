const urlModel = require("../models/urlModel");
const validUrl = require('valid-url')
const shortid = require('shortid')

//========================================VALIDATION FUNCTIONS==========================================================

const isValid = function(value) {
    if (!value || typeof value != "string" || value.trim().length == 0) return false;
    return true;
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

//========================================CREATE URL==========================================================
const baseUrl = 'http:localhost:3000'

const createUrl = async(req, res) => {
    data = req.body
    const { longUrl } = req.body

    if (!isValidRequestBody(data)) {
        return res.status(400).send({ status: false, message: "Body is required" })
    }

    if (!isValid(data.longUrl)) {
        return res.status(400).send({ status: false, message: "longUrl is required" })
    }

    // const longUrlValidator = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/

    // if (!longUrlValidator.test(longUrl)) {
    //     return res.status(400).send({ status: false, message: "plz enter a valid LongUrl" });
    // }

    // const isRegisteredurl = await urlModel.findOne({ urlCode });

    // if (isRegisteredurl) {
    //     return res.status(400).send({ status: false, message: "urlCode already registered" });
    // }

    // const isRegisteredshorturl = await urlModel.findOne({ shortUrl });

    // if (isRegisteredurl) {
    //     return res.status(400).send({ status: false, message: "urlCode already registered" });
    // }

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('Invalid base URL')
    }
    const urlCode = shortid.generate()
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await urlModel.findOne({
                longUrl
            })
            if (url) {
                res.json(url)
            } else {
                const shortUrl = baseUrl + '/' + urlCode
                url = new urlModel({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                })
                await url.save()
                res.json(url)
            }
        } catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } else {
        res.status(401).json('Invalid longUrl')
    }
}


module.exports = {
    createUrl
}