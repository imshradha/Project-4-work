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



const createBooks = async function (req, res) {
  try {

    let data = req.body;
    let userId = req.body.userId


    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, data: "Body is required" })
    }


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid Book-Id" });
    }

    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, data: "Title is required" })
    }

    let isRegisteredtitle = await booksModel.find({ title: data.title });

    if (isRegisteredtitle.length != 0) {
      return res.status(400).send({ status: false, message: "Title already registered" });
    }

    if (!isValid(data.excerpt)) {
      return res.status(400).send({ status: false, data: "excerpt is required" })
    }

    if (!isValid(data.userId)) {
      return res.status(400).send({ status: false, data: "userId is required" })
    }

    let validationuserId = await userModel.findById(data.userId);

    if (!validationuserId) {
      return res.status(400).send({ status: false, message: "User is not registered with us ", });
    }

    if (!isValid(data.ISBN)) {
      return res.status(400).send({ status: false, data: "ISBN is required" })
    }
    let isRegisteredISBN = await booksModel.findOne({ ISBN: data.ISBN });

    if (isRegisteredISBN) {
      return res.status(404).send({ status: false, message: "ISBN already registered" });
    }
    if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(data.ISBN)) {
      return res.status(400).send({ status: false, data: "plz enter a valid 13 digit ISBN No." });
    }

    let book = req.body;
    book.releasedAt = moment().format("DD-MM-YYYY")

    let bookCreated = await booksModel.create(book);
    res.status(201).send({ status: true, message: "Success", data: bookCreated });
  } catch (err) {
    res.status(500).send({ status: false, err: err.message });
  }
};

//============GET/books===========

const GetFilteredBook = async function (req, res) {
  try {
    let queryData = req.query

    if (queryData.isDeleted == "true") {
      return res.status(400).send({ status: false, data: "Books is already deleted" })
    }

    let obj = {}

    if (queryData.userId != undefined) {
      obj.userId = queryData.userId
    }
    if (queryData.category != undefined) {
      obj.category = queryData.category
    }
    if (queryData.subcategory != undefined) {
      obj.subcategory = queryData.subcategory
    }

    obj.isDeleted = false;


    const bookData = await booksModel.find(obj)
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

    const reviewByBookId = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ createdAt: 0, updatedAt: 0, isDeleted: 0 })

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

    let checkBook = await booksModel.findOne({ _id: bookId, isDeleted: false })

    if (!checkBook) {    // change -- add this for book not exist 
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

