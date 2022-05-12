const userModel = require('../models/userModel')
const booksModel = require('../models/booksModel')
const reviewModel = require("../models/reviewModel")
const moment = require('moment')
const mongoose = require("mongoose")
//------------------------------------------VALIDATION FUNCTIONS-------------------------------------------*/
const isValid = function (value) {
  if (typeof (value) == 'undefined' || value == null) return false
  if (typeof (value) == 'string' && value.trim().length > 0) return true
}

const isValidRequestBody = function (object) {
  return (Object.keys(object).length > 0)
}
const isValidIdType = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidObjectId = function (objectId) { // change -- add this validation to check object id type
  return mongoose.Types.ObjectId.isValid(objectId)
}


//////////////////////////////// create Review//////////////////////////////////////////////

const createReview = async function (req, res) {

  try {
    const bookId = req.params.bookId
    const data = req.body
    const { reviewedBy, rating } = req.body

    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Request body can not be empty" })
    }

    if (!bookId) {
      return res.status(400).send({ status: false, msg: "Book-Id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
    }

    const booksDetails = await booksModel.findOne({ _id: bookId, isDeleted: false })
    // console.log(booksDetails)
    if (!booksDetails) {
      return res.status(404).send({ status: false, msg: "Book-Id is not found in DB" });
    }

    if (!isValid(reviewedBy)) {
      data.reviewedBy = "Guest"
    }
    if (!rating || typeof rating != "number" || rating < 1 || rating > 5) {
      return res.status(400).send({ status: false, msg: "rating is required from 1 to 5" });
    }
    data.reviewedAt = moment().format("DD-MM-YYYY")
    data.bookId = bookId

    const reviewCreated = await reviewModel.create(data)

    const bookReviewCount = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()

    const updateBookReview = await booksModel.findByIdAndUpdate({ _id: bookId }, { reviews: bookReviewCount }, { new: true })

    return res.status(201).send({ status: true, message: "Success", data: reviewCreated })
  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}

// ========================================= review api to update review by id in parama =============================================================================// 


const updateReview = async function (req, res) {
  try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId
    let requestBody = req.body

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
      return
    }

    if (!isValidObjectId(bookId)) {       // change -- add this function
      res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
      return
    }

    if (!isValidObjectId(reviewId)) {       // change -- add this function
      res.status(400).send({ status: false, message: `${reviewId} is not a valid review id` })
      return
    }

    let checkreviewId = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
    if (!checkreviewId) {
      return res.status(404).send({ status: false, message: 'review with this bookid does not exist' })
    }

    let checkBookId = await booksModel.findOne({ _id: bookId, isDeleted: false })  // yeh wala kaam nahi aaya
    if (!checkBookId) {
      return res.status(404).send({ status: false, message: 'book does not exist in book model' })
    }



    let updateData = {}

    if (isValid(requestBody.review)) {
      updateData.review = requestBody.review
    }

    if (isValid(requestBody.reviewedBy)) {
      updateData.reviewedBy = requestBody.reviewedBy
    }

    if (requestBody.rating && typeof requestBody.rating === 'number' && requestBody.rating >= 1 && requestBody.rating <= 5) {
      updateData.rating = requestBody.rating
    }

    if (!(requestBody.rating >= 1 && requestBody.rating <= 5)) {
      return res.status(400).send({ status: false, message: "rating should be in range 1 to 5 " })
    }

    // kya hum rating ke liye kuch karna hai like yeh update toh nahi kar raha wahi rakh raha hain ,kya hume range batani hai

    const update = await reviewModel.findOneAndUpdate({ _id: reviewId }, updateData, { new: true })
    res.status(200).send({ status: true, message: 'review updated sucessfully', data: update })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}
//==========================================

const deleteBooksByIdAndReviewById = async function (req, res) {

  try {
    const queryParams = req.query
    const requestBody = req.body
    const bookId = req.params.bookId
    const reviewId = req.params.reviewId

    if (isValidRequestBody(queryParams)) {
      return res.status(400).send({ status: false, message: "invalid request" })
    }

    if (isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: "data is not required in request body" })
    }

    if (!bookId) {
      return res.status(400).send({ status: false, message: "bookId is required in path params" })
    }

    if (!isValidIdType(bookId)) {
      return res.status(400).send({ status: false, message: `enter a valid bookId` })
    }

    const bookByBookId = await booksModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null })

    if (!bookByBookId) {
      return res.status(404).send({ status: false, message: `No book found by ${bookId} ` })
    }

    if (!reviewId) {
      return res.status(400).send({ status: false, message: "reviewId is required in path params" })
    }

    if (!isValidIdType(reviewId)) {
      return res.status(400).send({ status: false, message: `enter a valid reviewId` })
    }

    const reviewByReviewId = await reviewModel.findOne({ _id: reviewId, isDeleted: false })

    if (!reviewByReviewId) {
      return res.status(404).send({ status: false, message: `no review found by ${reviewId}` })
    }

    if (reviewByReviewId.bookId != bookId) {
      return res.status(404).send({ status: false, message: "review is not from this book" })
    }

    const markDirtyReview = await reviewModel.findByIdAndUpdate(reviewId, { $set: { isDeleted: true } }, { new: true })

    res.status(200).send({ status: true, message: "review has been successfully deleted", deleteddata: markDirtyReview })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}


module.exports = { createReview, updateReview, deleteBooksByIdAndReviewById }
