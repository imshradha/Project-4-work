const mongoose = require('mongoose')
const moment = require('moment')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')


const isValid = function (value) {

  if (!value || typeof value != "string" || value.trim().length == 0) return false;
  return true;
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

//===============POST/blogs====================
const createBooks = async function (req, res) {
  try {

    let data = req.body;
    
     if(req.body.userId != req.UserLogin){
        return res.status(400).send({status: false, massage: "you are not authrized !!!!"})
    }
    if(!isValidRequestBody(data)){
      return res.status(400).send({ status: false, data: "Body is required" })
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
    if (
      Object.keys(data.userId).length == 0 ||
      data.userId.length == 0
    ) {
      return res.status(400).send({ status: false, data: "Enter a valid userId" });
    }
    let validationuserId = await userModel.findById(data.userId);
    if (!validationuserId) {
      return res.status(400).send({ status: false, message: "User is not registered with us ", });
    }
    if (!mongoose.Types.ObjectId.isValid(data.userId)) {
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    }
    if (!isValid(data.ISBN)) {
      return res.status(400).send({ status: false, data: "ISBN is required" })
    }
    let isRegisteredISBN = await booksModel.find({ ISBN: data.ISBN });
            if (isRegisteredISBN.length != 0) {
                return res.status(404).send({ status: false, message: "ISBN already registered" });
     }
    if (!/^[0-9-+()]*$/.test(data.ISBN)) {
      return res.status(400).send({ status: false, data: "plz enter a ISBN No." });
    }
    if(!isValid(data.category)) {
      return res.status(400).send({ status: false, data: "category is required" })
    }
    if (!isValid(data.subcategory))  {
      return res.status(400).send({ status: false, data: "subcategory is required" })
    }
    let book = req.body;
    let releasedAt = moment().format("DD-MM-YYYY, hh:mm a")

    book.releasedAt = releasedAt
    let bookCreated = await booksModel.create(book);
    res.status(201).send({ data: bookCreated });
  } catch (err) {
  res.status(500).send({ status: false, err: err.message });
}
};

module.exports = {
  createBooks,

}

