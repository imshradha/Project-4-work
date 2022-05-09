const mongoose = require('mongoose')
const moment=require('moment')
const ObjectId = mongoose.Types.objectId
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const booksModel = require('../models/booksModel')



//===============POST/blogs====================
const createBooks = async function(req, res) {
  try {
      let data = req.body;
      if (Object.keys(data).length != 0) {
          if (!data.title) {
              return res.status(400).send({ status: false, data: "Title is required" })
          }
          if (!data.excerpt) {
              return res.status(400).send({ status: false, data: "excerpt is required" })
          }
          if (!data.userId) {
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
              return res.status(400).send({status: false,message: "User is not registered with us ",});
          }
          if (!data.ISBN) {
              return res.status(400).send({ status: false, data: "ISBN is required" })
          }
          if (!/^[0-9-+()]*$/.test(data.ISBN)) {
            return res.status(400).send({ status: false, data: "plz enter a ISBN No." });
        }
          if (!data.category) {
              return res.status(400).send({ status: false, data: "category is required" })
          }
          if (!data.subcategory) {
              return res.status(400).send({ status: false, data: "subcategory is required" })
          }
          if (
              Object.keys(data.subcategory).length == 0 ||
              data.subcategory.length == 0
          ) {
              return res.status(400).send({ status: false, data: "Enter a valid Subcategory" });
          }
          if (!data.releasedAt) {
            return res.status(400).send({ status: false, data: "releasedAt is required" })
        }
        let book = req.body;
          let releasedAt=moment().format("DD-MM-YYYY, hh:mm a")

          book.releasedAt=releasedAt
          let bookCreated = await booksModel.create(book);
          res.status(201).send({ data: bookCreated });
      } else {
          return res.status(400).send({ msg: "Bad request" });
      }
  } catch (err) {
      res.status(500).send({ status: false, err: err.message });
  }
};

module.exports = {
 createBooks,
  
}

