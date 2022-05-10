const express = require('express');
const router = express.Router();

const {createBooks,GetFilteredBook,getBooksById,updateByBookId,deleteBooksBYId}
= require("../controllers/booksController")
const userController = require("../controllers/userController")
const {authentication,authorization} = require("../middleWare/userAuth")
<<<<<<< HEAD
// const {getBooksById,updateByBookId} =require('../extra work/mz')
const {createReview, updateReview,deleteBooksByIdAndReviewById} =require('../controllers/reviewController')
=======
const {getBooksById,updateByBookId} =require('../extra work/mz')
const {createReview, deleteBooksByIdAndReviewById} =require('../controllers/reviewController')
>>>>>>> f2933476763e669095aa0063b6a09fb46a8d0087


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
<<<<<<< HEAD
router.put('/books/:bookId/review/:reviewId',updateReview)
router.delete('/books/:bookId/review/:reviewId',deleteBooksByIdAndReviewById)
=======
router.delete('/books/:bookId/review/:reviewId', deleteBooksByIdAndReviewById);
// router.get('/books',authController.autherAuth, booksController.listBlog);
// router.put('/blogs',authController.autherAuth, blogController.updateBlog);
//  router.delete('/blogs/:blogId', authController.autherAuth, blogController.deleteBlogByID);
//  router.delete('/blogs',authController.autherAuth, blogController.deleteBlogByParams);
>>>>>>> f2933476763e669095aa0063b6a09fb46a8d0087

module.exports =  router;

