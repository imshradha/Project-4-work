const express = require('express');
const router = express.Router();

const {createBooks,GetFilteredBook,getBooksById,updateByBookId,deleteBooksBYId}
= require("../controllers/booksController")
const userController = require("../controllers/userController")
const {authentication,authorization} = require("../middleWare/userAuth")
// const {getBooksById,updateByBookId} =require('../extra work/mz')
const {createReview, updateReview,deleteBooksByIdAndReviewById} =require('../controllers/reviewController')


 // User routes
 router.post('/register', userController.createUser);
 router.post('/login', userController.loginUser);


//blog routes
router.post('/books', createBooks);
router.get('/books', GetFilteredBook);
router.get('/books/:bookId', getBooksById);
router.put('/books/:bookId', updateByBookId);
router.delete('/books/:bookId', deleteBooksBYId);

// Review routes
router.post('/books/:bookId/review',createReview)
router.put('/books/:bookId/review/:reviewId',updateReview)
router.delete('/books/:bookId/review/:reviewId',deleteBooksByIdAndReviewById)

module.exports =  router;

