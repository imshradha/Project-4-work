const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname : {
        type:String,
        required:'first name is required',
        trim: true
    },
    lname : {
        type:String,
        required:'first name is required',
        trim: true,
    },
    title : {
        type:String,
        required:'Title is required',
        enum:["Mr","Mrs","Miss", "Mast"]
    },

    email : {
        type:String,
        trim: true,
        lowercase: true,
        required:'Email address is required',
        required:true,
        unique:true ,
        validate:{
            validator: function(email){
               return  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
            }, message: 'please fill a valid email address',isAsync: false
        }    
     },
    password : {
        type:String,
        trim: true,
        required:'Password is required',
    },
},{timestamps:true})

module.exports = mongoose.model("Author", authorSchema)