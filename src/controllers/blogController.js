const mongoose = require('mongoose')
const ObjectId = mongoose.Types.objectId
const authorModel = require('../models//authorModel')
const blogModel = require('../models/blogModel')


const isValid = function(value){
  if(typeof value === 'undefined' || value === null) return false
  if(typeof value === 'string' && value.trim().length === 0) return false
  return true;
} 
const isValidRequestBody = function(requestBody){
    return Object.keys(requestBody).length != 0 
}
const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

//----------------Create Blog POST /blogs

const CreateBlog = async function (req, res) {

    try {
        const requestBody = req.body;
        
        // if(isValidRequestBody(requestBody)){
        //   console.log(requestBody)
        //     res.status(400).send({status: false, message: 'Invalid request parameters.Please provide blog details'})
        //     return
        // }

            //Extract Params
        const {title,body,authorId,tags,category,subcategory,isPublished} = requestBody;

        //Validation starts

        if(!isValid(title)){
            res.status(400).send({status: false, message:'Blog title is required'})
            return
        }
        if(isValid(body)){
            res.status(400).send({status:false, message:'Blog body is required'})
            return
        }
        if(isValid(authorId)){
            res.status(400).send({status:false, message:'AuthorId is required'})
        }
        if(!isValidObjectId(authorId)){
            res.status(400).send({status:false , message: '${authorId}is not a valid author id'})
            return
        }
        if(!isValid(category)){
            res.status(400).send({status:false , message: 'Blog category is required'})
            return
        }

        const author = await authorModel.findById(authorId);
        if(!author){
            res.status(400).send({status:false, message:'Author does not exist' })
            return        
        }

        // Validation ends

        const blogData ={
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false, 
            publishedAt:  isPublished ? new Date() : null

        }
       if(tags){
           if(Array.isArray(tags)){
               blogData['tags'] = [...tags]
           }
           if(Object.prototype.toString.call(tags) === "[Object String]"){
               blogData['tags'] = [tags]
           }
       }
       if(subcategory){
           if(Array.isArray(subcategory)){
               blogData['subcategory'] = [...subcategory]
           }
           if(Object.prototype.toString.call(subcategory) === "[Object string]"){
               blogData['subcategory'] = [subcategory]
           }
       }

       const newBlog = await blogModel.create(blogData)
       res.status(201).send({status:true, message: 'New blog created successfully',date: newBlog})
    } catch (error) {
        console.log(error)
        res.status(500).send({status:false,message : error.message});
    }
  }

     const listBlog = async function (req,res){
         try{
             const filterQuery = {isDeleted: false, deletedAt: null, isPublished: true}
             const queryParam =  req.query

             if(isValidRequestBody(queryParam)){
                 const {authorId,category,tags,subcategory} = queryParam

             if(isValid(authorId) && isValidObjectId(authorId)) {
              filterQuery['authorId'] = authorId
             }

             if(isValid(category)){
                 filterQuery['category'] = category.trim()
             }

             if(isValid(tags)){
                 const tagsArr = tags.trim().split(',').map(tag => tag.trim());
                 filterQuery['tags'] = {$all: tagsArr}
             }

             if(isValid(subcategory)){
                 const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                 filterQuery['subcategory'] = {$all: subcatArr}
             }

             }


             const blogs = await blogModel.find(filterQuery)
             console.log(blogs);

             if(Array.isArray(blogs) && blogs.length===0){
                 res.status(404).send({status: false, message:'No blog found'})
                 return
             }
              res.status(200).send({status: true, message :'Blog list',data: blogs})

         } catch (error){
             res.status(500).send({status: false, message: error.message});
         }

        }

 const updateBlog = async function(req,res){
          try{
              const requestBody = req.body
              const params = req.params
              const blogId = req.blogId
              const authorIdFromToken = req.authorId
    
             //Validation starts
    
             if(!isValidObjectId(blogId)){
                 res.status(400).send({status: false , message: '${blogId} is not a valid blog id'})
                 return
             }
    
             if(!isValidObjectId(authorIdFromToken)){
                 res.status(400).send({status: false , message: '${authorIdFromToken} is not a valid Token Id'})
                 return
             }
    
             const blog = await blogModel.findOne({_id:blogId, isDeleted: false, deletedAt: null})
    
             if(!blog){
                 res.status(404).send({ststus:false,message:'Blog not found'})
                 return
             }
             if(blog.authorId.toString() !== authorIdFromToken){
                 res.status(401).send({ststus: false,message: 'Unauthorised access! Owner info dosent match'});
                 return
             }
    
            //  if(!isValidRequestBody(requestBody)){
            //      res.status(200).send({status:true , message: 'No paramaters passed. Blog unmodified',data: blog})
            //      return
            //  }
    
            // Extract params
            const {title,body,tags,category,subcategory,isPublished} = requestBody;
    
            const updateBlogData = {}
             
            if(isValid(title)) {
                if(!Object.prototype.hasOwnProperty.call(updateBlogData, '$set')) updateBlogData['$set'] = {}
                updateBlogData['$set']['title'] = title
            }
    
            if(isValid(body)){
                if(!Object.prototype.hasOwnProperty.call(updateBlogData,'$set')) updateBlogData['$set'] = {}
                updateBlogData['$set']['body'] = body
            }
            
            if(isValid(category)){
                if(!Object.prototype.hasOwnProperty.call(updateBlogData,'$set')) updateBlogData['$set'] = {}
                updateBlogData['$set']['category'] = category
            }
            
            if(isPublished  !== undefined){
                if(!Object.prototype.hasOwnProperty.call(updateBlogData,'$set')) updateBlogData['$set'] = {}
                updateBlogData['$set']['isPublished'] = isPublished
                updateBlogData['$set']['published'] = isPublished ? new Date() : null
            }
    
            if(tags){
                if(!Object.prototype.hasOwnProperty.call(updateBlogData,'$addToSet')) updateBlogData['$addToSet'] = {}
                if(Array.isArray(tags)){
                updateBlogData['$addToSet']['tags'] = {$each: [...tags]}
                } 
                if(typeof tags=== "string") {
              updateBlogData['$addToSet']['tags'] = tags
                }   
            }
            if(subcategory){
                if(!Object.prototype.hasOwnProperty.call(updateBlogData,'$addToSet')) updateBlogData['$addToSet'] = {}
                if(Array.isArray(tags)){
                updateBlogData['$addToSet']['tags'] = {$each: [...subcategory]}
                } 
                if(typeof subcategory === "string") {
              updateBlogData['$addToSet']['subcategory'] = subcategory
                }   
            }
               
            const updateBlog = await blogModel.findOneAndUpdate({_id: blogId},updateBlogData,{new:true})
            res.status(200).send({status:true, message: 'blog updated successfully', data: updateBlog});
          } catch(error){
              res.status(500).send({status:false,message:error.message});
          }
    
    
        }    

                
const deleteBlogByID = async function (req, res){
  try{
      const params = req.params
      const blogId = params.blogId
      const authorIdFromToken = req.authorId
      

      if(!isValidObjectId(blogId)) {
          res.status(400).send({statsu:false,message: `${blogId} is not a valid blog Id`})
          return
      }
      if(!isValidObjectId(authorIdFromToken)) {
          res.status(400).send({statsu:false,message: `${authorIdFromToken} is not a valid token Id`})
          return
      }
      const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null})

      if(!blog) {
          res.status(404).send({status: false, message:`Blog not found`})
          return
      }
      if(blog.authorId.tostring()!== authorIdFromToken){
          res.status(401).send({status: false, message: `Unauthorized access! Owner info doesnot match  `});
          return
      }
      await blogmodel.findOneAndUpdate({_id:blogId},{$set: {isDeleted: true, deletedAt:new Date()}})
      res.status(200).send({status: true, message:` Blog is deleted Successfully`});

      }catch (error){
          res.status(500).send({status: false, message:error.message}); 
      }
  }
  const deleteBlogByParams = async function(req,res) {
      try{
          const filterQuery = {isDeleted: false,deleteAt:null}
          const queryParams = req.query
          const authorIdFromToken = req.authorId
          if(!isValidObjectId(authorIdFromToken)) {
              res.status(400).send({statsu:false,message: `${authorIdFromToken} is not a valid blog Id`})
              return
          }
          if(!isValidObjectId(queryParams)) {
              res.status(400).send({statsu:false,message: `No query received. Aborting delete operation`})
              return 

      }
      const{authorId,category,tags,subcategory,isPublished} = queryParams
      if(isValid(authorId)&&isValidObjectId(authorId)){
          filterQuery[`authorId`] = authorId
      }

      if(isValid(`category`)){
          filterQuery[`category`] = category.trim()
      }

      if(isValid(`ispublished`)){
          filterQuery[`ispublished`] = isPublished.trim()
      }

      if(isValid(`tags`)){
          const tagsArr = tags.trim().split(``).map(subcat => subcat.trim());
          filterQuery[`tags`] = {$all: tagsArr}
      }
      const blog = await blogModel.find(filterQuery);

      if(Array.isArray(blog) && blog.length ===0){
          res.status(404).send({statsu:false,message: `No matching blogs found`})
          return
      }
      const idsOfBlogsToDelete = blogs.map(blog => {
          if (blog.authorId.toString() === authorIdFromToken) return blog._id
      })
      if(idsOfBlogsToDelete.length ===0){
          res.status(404).send({statsu:false,message: `No blogs found`})
          return
      }
      await blogModel.updateMany({_id:{$in: idsOfBlogsToDelete}},{$set: { isDeleted: true, deleteAt: new Date()}})
      res.status(200).send({status:true, message:`Blog(s) deleted successfully`});
  }catch (error){
      res.status(500).send({status: false, message:error.message}); 
  }
}

module.exports = {}

module.exports = {
  CreateBlog,
  listBlog,
  updateBlog,
  deleteBlogByParams,
  deleteBlogByID,
}