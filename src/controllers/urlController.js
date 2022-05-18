const UrlModel = require('../models/urlModel')
const validUrl = require('valid-url')
const RandomString = require('randomstring')
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13190,
    "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com", { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function(err) {
    if (err) throw err;
});

redisClient.on("connect", async function() {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const generateShortUrl = async function(req, res) {
    try {
        let data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, message: " You must provide data first " })

        if (!(validUrl.isWebUri(data.longUrl.trim()))) return res.status(400).send({ status: false, message: "Please Provide a valid long Url" })

        let checkUrl = await UrlModel.findOne({ longUrl: data.longUrl })

        if (checkUrl) return res.status(400).send({ status: false, message: " With this Long url already a shorted Url already exists, Please Enter a New One" })

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
        let data = req.params.urlCode

        const urlData = await UrlModel.findOne({ urlCode: data })
        if (!urlData) return res.status(404).send({ status: false, message: "Url code does not found" })

        res.status(302).redirect(302, urlData.longUrl)
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {
    generateShortUrl,
    getUrlCode,

}
