const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
const booksSchema = new mongoose.Schema({

title: {
    type:String,
    required: true,
    unique: true,
},
excerpt:{
    type: String,
    required: true,
}, 
userId:{
    type: ObjectId,
    required:true,
    ref:"User"
},
ISBN:{
    type:String,
    required: true,
    unique: true,
},
category: {
    type: String,
    required: true,
},
subcategory: [{
    type: String,
    required: true,
}],
reviews:{
    type: Number,
    default: 0,
    comment:{
        type: String
    }
},
deletedAt :{
    type:Date,
    default: null,
},
isDeleted: {
    type:Boolean, 
    default: false
},
publishedAt:{
    type:Date,
    default: null,
},  
releasedAt:{
    type: String,
    required: true,
},
},{timestamps:true})
module.exports = mongoose.model("Books", booksSchema)