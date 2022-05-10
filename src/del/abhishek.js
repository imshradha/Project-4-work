//-------------------------- User login part end ------------------------------------//
//
const deleteBooksBYId = async function (req, res) {
    try {
      let bookId = req.params.bookId
  
      let checkBook = await bookModels.findOne({ _id: bookId, isDeleted: false })
  
      if(!checkBook){    // change -- add this for book not exist 
        return res.status(404).send({status:false,message:'book not found or already deleted'})
      }
  
      // if(!(req.validToken._id == checkBook.userId)){
      //   return res.status(400).send({status:false,message:'unauthorized access'})
      // }
  
      let updateBook = await bookModels.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: moment().format("DD-MM-YYYY, hh:mm a") }, { new: true })
  
      res.status(200).send({ status: true, message: 'sucessfully deleted', data: updateBook })
  
    } catch (error) {
      res.status(500).send({ status: false, error: error.message });
    }
  }
// ----------------------------
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number') return false
    return true;
  }
  
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
  }
  
  const isValidObjectId = function(objectId) { // change -- add this validation to check object id type
    return mongoose.Types.ObjectId.isValid(objectId)
  }


// ===============================================================================================================================================================//

// ========================================= nine api to update review by id in parama =============================================================================// 


const updateReview = async function (req, res) {
    try {
      let bookId = req.params.bookId
      let reviewId = req.params.reviewId
      let requestBody = req.body
  
      if (!isValidRequestBody(requestBody)) {
        res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
        return
      }
  
      if(!isValidObjectId(bookId)) {       // change -- add this function
        res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
        return
    }
  
    if(!isValidObjectId(reviewId)) {       // change -- add this function
      res.status(400).send({status: false, message: `${reviewId} is not a valid review id`})
      return
  }
  
      let checkreviewId = await reviewModel.findOne({ _id: reviewId,bookId:bookId, isDeleted: false })
      if (!checkreviewId) {
        return res.status(404).send({ status: false, message: 'review with this bookid does not exist' })
      }
  
      let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })  // yeh wala kaam nahi aaya
      if (!checkBookId) {
        return res.status(404).send({ status: false, message: 'book does not exist in book model' })
      }
  
      
  
      let updateData = {}
  
      if (isValid(requestBody.review)) {
        updateData.review = requestBody.review
      }
  
      if (isValid(requestBody.reviewedBy)) {
        updateData.reviewedBy = requestBody.reviewedBy
      }
      
      if (requestBody.rating && typeof requestBody.rating === 'number' && requestBody.rating >= 1 && requestBody.rating <= 5) {
        updateData.rating = requestBody.rating
      }
      
      if(!(requestBody.rating >= 1 && requestBody.rating <= 5)){
        return res.status(400).send({status:false, message: "rating should be in range 1 to 5 "})
      }
  
      // kya hum rating ke liye kuch karna hai like yeh update toh nahi kar raha wahi rakh raha hain ,kya hume range batani hai
      
      const update = await reviewModel.findOneAndUpdate({ _id: reviewId }, updateData, { new: true })
      res.status(200).send({ status: true, message: 'review updated sucessfully', data: update })
  
    } catch (error) {
      res.status(500).send({ status: false, error: error.message });
    }
  }  