const userModel = require('../models/userModel')
const booksModel = require('../models/booksModel')
const reviewModel = require("../models/reviewModel")
const moment =require('moment')
const mongoose = require("mongoose")
//*************************************VALIDATION FUNCTIONS************************************************* */
const isValid = function(value){
    if(typeof (value) == 'undefined' || value == null) return false
    if(typeof (value) == 'string' && value.trim().length > 0) return true
}

const isValidRequestBody = function(object){
return (Object.keys(object).length > 0)
}

const isValidIdType = function(objectId){
return mongoose.Types.ObjectId.isValid(objectId)
}
//////////////////////////////// create Review//////////////////////////////////////////////

const createReview = async function (req, res) {

    try {
        const bookId=req.params.bookId
        const data = req.body
        const {reviewedBy, rating } = req.body

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Request body can not be empty" })
        }

        if (!bookId) {
            return res.status(400).send({ status: false, msg: "Book-Id is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
        }

        const booksDetails =await booksModel.findOne({_id:bookId, isDeleted:false})
        // console.log(booksDetails)
        if(!booksDetails){
            return res.status(404).send({ status: false, msg: "Book-Id is not found in DB" });
        }

        if (!isValid(reviewedBy)) {
           data.reviewedBy="Guest"
        }
        if (!rating || typeof rating != "number" || rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "rating is required from 1 to 5" });
        }
        data.reviewedAt =  moment().format("DD-MM-YYYY")
        data.bookId=bookId
        // console.log(data)
        const reviewCreated = await reviewModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: reviewCreated })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


const deleteBooksByIdAndReviewById = async function (req, res) {

    try{
        const queryParams = req.query
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if(isValidRequestBody(queryParams)){
        return  res.status(400).send({status: false, message : "invalid request"})
        }

        if(isValidRequestBody(requestBody)){
        return  res.status(400).send({status : false, message : "data is not required in request body"})
        }
        
        if(!bookId){
        return res.status(400).send({status : false, message : "bookId is required in path params"})
        }   

        if(!isValidIdType(bookId)){
        return  res.status(400).send({status : false, message : `enter a valid bookId`})
        }

        const bookByBookId = await booksModel.findOne({_id : bookId, isDeleted : false, deletedAt : null})

        if(!bookByBookId){
        return res.status(404).send({status : false, message : `No book found by ${bookId} `})
        }

        if(!reviewId){
        return res.status(400).send({status : false, message : "reviewId is required in path params"})
        }   
    
        if(!isValidIdType(reviewId)){
        return  res.status(400).send({status : false, message : `enter a valid reviewId`})
        }

        const reviewByReviewId = await reviewModel.findOne({_id : reviewId, isDeleted : false})

        if(!reviewByReviewId){
        return res.status(404).send({status : false, message : `no review found by ${reviewId}`})
        }

        if(reviewByReviewId.bookId != bookId){
        return res.status(404).send({status : false, message : "review is not from this book"})  
        }

        const markDirtyReview = await reviewModel.findByIdAndUpdate(reviewId, {$set : {isDeleted : true}}, {new : true})

        const updateReviewCountInBook = await booksModel.findByIdAndUpdate(bookId, {$inc : {reviews : -1}}, {new : true})

        res.status(200).send({status: true, message : "review has been successfully deleted"})
        
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


module.exports={createReview, deleteBooksByIdAndReviewById}
module.exports={createReview}
