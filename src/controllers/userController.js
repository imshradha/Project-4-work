const userModel = require('../models/userModel')
let  jwt = require("jsonwebtoken");



// const loginAuthor = async function(req,res){
//   try{
//     const requestBody = req.body;
//     if(!isValidRequestBody(requestBody)){
//       res.status(400).send({status: false, message: 'Invalid request pareameters. Please provide login details'})
//       return
//     }
//     // Extract params
//     const {email, password} = requestBody;
//     // valitaion starts
//     if(!isValid(email)){
//       res.status(400).send({status: false, message: `Email is requred`})
//       return
//     }
//     if(!( /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))){
//       res.status(400).send({status: false, message: `Email should be a valid eamil address`})
//       return
//     }
//     if(!isValid(password)){
//       res.status(400).send({status: false, message: `password is requried`})
//       return
//     }
//     // validation ends

//     const author = await authorModel.findOne({email,password})
//     if(!author){
//       res.status(401).send({status: false, message: `Invalid login credentials`});
//       return
//     }

//     const token = await jwt.sign({
//       authorId: author._id,
//       Aman: "aman",
//       // iat: Math.floot(date.now() / 1000),
//       // exp: Math.floor(date.now() / 1000) + 10*60*60,
//     }, 'someverysecuredprivatekey291@(*#*(@(@()')

//     res.header('x-api-key', token);
//     console.log(token)
//     res.status(200).send({status: true, message: `Author login successfull`, data: {token}})

//   }catch(error){
//     res.status(500).send({status: false, massage: error.massage})
//   }
// }



module.exports ={  loginAuthor }