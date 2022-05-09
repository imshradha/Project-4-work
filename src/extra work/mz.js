
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')
const mongoose = require("mongoose")



const getBooksById = async function (req, res) {
    try {
        const bookId = req.params.bookId
        console.log(bookId)
        if (!bookId) {
            return res.status(400).send({ status: false, message: "Book-Id is required" })
        }
        if ((!mongoose.Types.ObjectId.isValid(bookId))) {
            return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
        }
        const isbookIdInDB = await booksModel.findById(bookId)
        console.log(isbookIdInDB)
        if (!isbookIdInDB) {
            return res.status(404).send({ status: false, msg: "Book-Id is not present in DB" });
        }
        const reviewByBookId = await reviewModel.find({ bookId }).select({ createdAt: 0, updatedAt: 0, isDeleted: 0 })

       
        if (reviewByBookId.length == 0) {
           
            let obj = {
                _id: isbookIdInDB._id,
                title: isbookIdInDB.title,
                excerpt: isbookIdInDB.excerpt,
                userId:isbookIdInDB.userId,
                category:isbookIdInDB.category,
                subcategory:isbookIdInDB.subcategory,
                isDeleted: isbookIdInDB.isDeleted,
                reviews: isbookIdInDB.reviews,
                deletedAt:isbookIdInDB.deletedAt, 
                releasedAt: isbookIdInDB.releasedAt,
                createdAt: isbookIdInDB.createdAt,
                updatedAt: isbookIdInDB.updatedAt,
                reviewsData : "No review Found" 
            }
            return res.status(200).send({ status: true, message: "Success", data: obj })
        }
         
        let obj = {
            _id: isbookIdInDB._id,
            title: isbookIdInDB.title,
            excerpt: isbookIdInDB.excerpt,
            userId:isbookIdInDB.userId,
            category:isbookIdInDB.category,
            subcategory:isbookIdInDB.subcategory,
            isDeleted: isbookIdInDB.isDeleted,
            reviews: isbookIdInDB.reviews,
            deletedAt:isbookIdInDB.deletedAt, 
            releasedAt: isbookIdInDB.releasedAt,
            createdAt: isbookIdInDB.createdAt,
            updatedAt: isbookIdInDB.updatedAt,
            reviewsData : reviewByBookId 
        }
       

        return res.status(200).send({ status: true, message: "Success", data: obj })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { getBooksById }

