const UrlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const RandomString = require('randomstring')

const generateShortUrl = async function(req, res) {
    try {
        let data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: " You must provide data first " })

        if (!(validUrl.isWebUri(data.longUrl.trim()))) return res.status(400).send({ status: false, message: "Please Provide a valid long Url" })

        let checkUrl = await UrlModel.findOne({ longUrl: data.longUrl })

        if (checkUrl) return res.status(400).send({ status: false, message: " Long url already Exists! and already shorted" })

        let urlCode = RandomString.generate({ length: 6, charset: "alphabetic" }).toLowerCase()

        let shortUrl = `http://localhost:3000/${urlCode}`

        data.urlCode = urlCode;
        data.shortUrl = shortUrl;

        let createUrl = await UrlModel.create(data)
        return res.status(201).send({ status: true, data: createUrl })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



//=========================================GET URL=============================================//

const getUrlCode = async function(req, res) {
    try {
        let urlCode = req.params.urlCode
            // find a document match to the code in in urlcode
        const url = await urlModel.findOne({ urlCode })

        //if no url found return a not found 404 status
        if (!url) return res.status(404).send({ status: false, message: "Url not found" })
        if (url) {
            // when valid we perform a redirect
            return res.redirect(url.longUrl)
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {
    generateShortUrl,
    getUrlCode
}