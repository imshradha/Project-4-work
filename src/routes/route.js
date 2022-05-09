const express = require('express');
const router = express.Router();

const booksController = require("../controllers/booksController")
const userController = require("../controllers/userController")


 // User routes
 router.post('/register', userController.createUser);
//  router.post('/login', userController.loginAuthor);


//blog routes
router.post('/books', booksController.createBooks);
// router.get('/books',authController.autherAuth, booksController.listBlog);
// router.put('/blogs',authController.autherAuth, blogController.updateBlog);
//  router.delete('/blogs/:blogId', authController.autherAuth, blogController.deleteBlogByID);
//  router.delete('/blogs',authController.autherAuth, blogController.deleteBlogByParams);

module.exports =  router;

