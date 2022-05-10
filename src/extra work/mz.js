
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')
const mongoose = require("mongoose")
const moment = require("moment")



const getBooksById = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Book-Id is required" })
        }

        if ((!mongoose.Types.ObjectId.isValid(bookId))) {
            return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
        }

        const isbookIdInDB = await booksModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0}).lean()
       
        if (!isbookIdInDB) {
            return res.status(404).send({ status: false, msg: "Book-Id is not present in DB" });
        }
        
        const reviewByBookId = await reviewModel.find({ boolId: bookId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, isDeleted: 0 })


        if (reviewByBookId.length == 0) {

            isbookIdInDB["reviewsData"]=[]
            return res.status(200).send({ status: true, message: "Success", data: isbookIdInDB })
        }

       isbookIdInDB["reviewsData"]=reviewByBookId

        return res.status(200).send({ status: true, message: "Success", data: isbookIdInDB })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
//===================

const isValid = function (value) {

    if (!value || typeof value != "string" || value.trim().length == 0) return false;
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


const updateByBookId = async function (req, res) {

    try {
        const bookId = req.params.bookId
        const data = req.body

        if (!(data.title || data.excerpt || data.ISBN || data.releasedAt)) {
            return res.status(400).send({ status: false, msg: "Invalid Filters" })
        }

        if (!bookId) {
            return res.status(400).send({ status: false, message: "Book-Id is required" })
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
        }
        const isbookIdInDB = await booksModel.findOne({ _id: bookId, isDeleted: false })

        if (!isbookIdInDB) {
            return res.status(404).send({ status: false, msg: "Book-Id is not present in DB" });
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, data: "Body is required" })
        }

        let isRegisteredtitle = await booksModel.findOne({ title: data.title });
       
        if (isRegisteredtitle) {
            return res.status(404).send({ status: false, message: "Title already registered" });
        }

        let isRegisteredISBN = await booksModel.findOne({ ISBN: data.ISBN });

        if (isRegisteredISBN) {
            return res.status(404).send({ status: false, message: "ISBN already registered" });
        }

        const updateById = await booksModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, {
            $set: {
                title: data.title, excerpt: data.excerpt, releasedAt: moment().format("DD-MM-YYYY"), ISBN: data.ISBN
            }
        }, { new: true });
        
        if(!updateById){
            return res.status(404).send({ status: false, message: "No Data Match" });
        }
       
        return res.status(200).send({ status: true, message: "Success", data: updateById })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { getBooksById, updateByBookId }

