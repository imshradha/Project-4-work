const mongoose = require('mongoose')
const moment = require('moment')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')



//===============POST/books====================
const isValid = function (value) {

  if (!value || typeof value != "string" || value.trim().length == 0) return false;
  return true;
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}
const isValidObjectId = function (objectId) { // change -- add this validation to check object id type
  return mongoose.Types.ObjectId.isValid(objectId)
}


const createBooks = async function (req, res) {
  try {

    const data = req.body;

    let { title, excerpt, ISBN, releasedAt, userId, category, subcategory } = req.body

    const ISBN_ValidatorRegEx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

    const releasedAt_ValidatorRegEx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: "Body is required" })
    }

    if ((data.isDeleted && typeof data.isDeleted != "boolean") || data.isDeleted == true) {
      return res.status(400).send({ status: false, message: "isDeleted must be false" })
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid User-Id" });
    }

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: "Title is required" })
    }

    let isRegisteredTitle = await booksModel.findOne({ title }).lean();

    if (isRegisteredTitle) {
      return res.status(400).send({ status: false, message: "Title already registered" });
    }

    if (!isValid(excerpt)) {
      return res.status(400).send({ status: false, message: "excerpt is required" })
    }

    let validationUserId = await userModel.findById(userId).lean();

    if (!validationUserId) {
      return res.status(400).send({ status: false, message: "User is not registered ... ", });
    }

    if (!isValid(ISBN)) {
      return res.status(400).send({ status: false, data: "ISBN is required..." })
    }

    let isRegisteredISBN = await booksModel.findOne({ ISBN }).lean();

    if (isRegisteredISBN) {
      return res.status(404).send({ status: false, message: "ISBN already registered" });
    }

    if (!ISBN_ValidatorRegEx.test(ISBN)) {
      return res.status(400).send({ status: false, data: "plz enter a valid 13 digit ISBN No." });
    }

    if (!isValid(category)) {
      return res.status(400).send({ status: false, data: "Category is required..." })
    }
    if (!subcategory) {
      return res.status(400).send({ status: false, data: "subcategory is required..." })
    }

    if (!Array.isArray(subcategory)) {
      return res.status(400).send({ status: false, data: "Subcategory is must be an array of String" })
    }

    let validSubcategory = true;
    const checkTypeofSubcategory = subcategory.map(x => {
      if (typeof x != "string" || x.trim().length == 0) {
        validSubcategory = false
      }
    })

    if (validSubcategory == false) {
      return res.status(400).send({ status: false, data: "Subcategory is not valid..." })
    }

    if (!releasedAt) {
      return res.status(400).send({ status: false, message: "Please provide released-date" });
    }

    if (!releasedAt_ValidatorRegEx.test(releasedAt)) {
      return res.status(400).send({ status: false, data: "plz enter a valid Date format" });
    }

    let bookCreated = await booksModel.create(data)

    res.status(201).send({ status: true, message: "Success", data: bookCreated });

  }
  catch (err) {
    res.status(500).send({ status: false, err: err.message });
  }
};

//============GET/books===========

const GetFilteredBook = async function (req, res) {
  try {
    let queryData = req.query

    // if (queryData.isDeleted == "true") {
    //   return res.status(400).send({ status: false, data: "Books is already deleted" })
    // }
    if ((queryData.isDeleted && typeof queryData.isDeleted != "boolean") || queryData.isDeleted == true) {
      return res.status(400).send({ status: false, message: "isDeleted must be false" })
    }

    let obj = {}

    if (queryData.userId != undefined) {
      obj.userId = queryData.userId
    }
    if (queryData.category != undefined) {
      obj.category = queryData.category
    }
    if (queryData.subcategory != undefined) {
      obj.subcategory = { $all: [].concat(queryData.subcategory) }
    }

    obj.isDeleted = false;

    const bookData = await booksModel.find(obj).select({ __v: 0 }).sort({ title: 1 }).lean()
    if (bookData.length == 0) {
      return res.status(400).send({ status: false, data: "No Books found" })
    }
    return res.status(200).send({ status: true, data: bookData })
  } catch (err) {
    res.status(500).send({ status: false, err: err.message });
  }
};

//===============POST/get books by id====================

const getBooksById = async function (req, res) {
  try {
    const bookId = req.params.bookId

    if (!bookId) {
      return res.status(400).send({ status: false, message: "Book-Id is required" })
    }

    if ((!mongoose.Types.ObjectId.isValid(bookId))) {
      return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
    }

    const isbookIdInDB = await booksModel.findOne({ _id: bookId, isDeleted: false }).select({ __v: 0 }).lean()

    if (!isbookIdInDB) {
      return res.status(404).send({ status: false, msg: "Book-Id is not present in DB" });
    }

    const reviewByBookId = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, isDeleted: 0, __v: 0 })

    isbookIdInDB["reviewsData"] = reviewByBookId

    return res.status(200).send({ status: true, message: "Success", data: isbookIdInDB })


  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}
//===================//===============PUT/update by book Id====================

const updateByBookId = async function (req, res) {

  try {
    const bookId = req.params.bookId
    const data = req.body
    const ISBN_ValidatorRegEx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;

    const releasedAt_ValidatorRegEx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, data: "Body is required" })
    }

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

   
    let isRegisteredtitle = await booksModel.findOne({ title: data.title });

    if (isRegisteredtitle) {
      return res.status(404).send({ status: false, message: "Title already registered" });
    }

    let isRegisteredISBN = await booksModel.findOne({ ISBN: data.ISBN });

    if (isRegisteredISBN) {
      return res.status(404).send({ status: false, message: "ISBN already registered" });
    }

    if (!ISBN_ValidatorRegEx.test(data.ISBN)) {
      return res.status(400).send({ status: false, data: "plz enter a valid 13 digit ISBN No." });
    }
    if (data.releasedAt && !releasedAt_ValidatorRegEx.test(data.releasedAt)) {
      return res.status(400).send({ status: false, data: "plz enter a valid Date format" });
    }


    const updateById = await booksModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, {
      $set: {
        title: data.title, excerpt: data.excerpt, releasedAt: data.releasedAt, ISBN: data.ISBN
      }
    }, { new: true });

    if (!updateById) {
      return res.status(404).send({ status: false, message: "No Data Match" });
    }

    return res.status(200).send({ status: true, message: "Success", data: updateById })

  }
  catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}

//===============DELETE/By bookid====================


const deleteBooksBYId = async function (req, res) {
  try {
    let bookId = req.params.bookId
    const queryParams = req.query
    const requestBody = req.body

    if (isValidRequestBody(queryParams)) {
      return res.status(400).send({ status: false, message: "invalid request" })
    }

    if (isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, message: "Data is not required in request body" })
    }

    let checkBook = await booksModel.findOne({ _id: bookId, isDeleted: false })

    if (!checkBook) { // change -- add this for book not exist 
      return res.status(404).send({ status: false, message: 'book not found or already deleted' })
    }

    let updateBook = await booksModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: moment().format("DD-MM-YYYY, hh:mm a") }, { new: true })

    res.status(200).send({ status: true, message: 'sucessfully deleted', data: updateBook })

  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

module.exports = {
  createBooks,
  GetFilteredBook,
  getBooksById,
  updateByBookId,
  deleteBooksBYId

}

