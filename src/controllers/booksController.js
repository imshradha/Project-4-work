const mongoose = require('mongoose')
const moment = require('moment')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')



//===============POST/blogs====================
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
    if (!/^[0-9-+()]*$/.test(data.ISBN)) {
      return res.status(400).send({ status: false, data: "plz enter a ISBN No." });
    }
    
    let book = req.body;
    book.releasedAt = moment().format("DD-MM-YYYY")

    let bookCreated = await booksModel.create(book);
    res.status(201).send({status:true, message:"Success", data: bookCreated });
  } catch (err) {
    res.status(500).send({ status: false, err: err.message });
  }
};

module.exports = {
  createBooks,

}

