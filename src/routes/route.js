const express = require('express');
const router = express.Router();

const authorController = require("../controllers/authorController")
 const blogController = require("../controllers/blogController")
const authController = require('../middleWare/authorAuth')


//author routes
router.post('/authors', authorController.registerAuthor);
router.post('/login', authorController.loginAuthor);


//blog routes
router.post('/blogs',authController.autherAuth, blogController.CreateBlog);
router.get('/blogs',authController.autherAuth, blogController.listBlog);
router.put('/blogs',authController.autherAuth, blogController.updateBlog);
 router.delete('/blogs/:blogId', authController.autherAuth, blogController.deleteBlogByID);
 router.delete('/blogs',authController.autherAuth, blogController.deleteBlogByParams);

module.exports =  router;

