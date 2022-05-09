const authorModel = require('../models/authorModel')
let  jwt = require("jsonwebtoken");

const isValid = function(value){
  if(typeof value === 'undefined' || value === null) return false
  if(typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidTitle = function(title){
  return ['Mr','Mrs', 'Miss', 'Mast'].indexOf(title) !== -1
}
const isValidRequestBody = function(requestBody){
  return Object.keys(requestBody).lenght != 0
}

const registerAuthor = async function(req, res){
  try{
    const requestBody = req.body;
    console.log(requestBody)
    if(!isValidRequestBody(requestBody)){
      res.status(400).send({status: false, massage: 'Invalid request parameters. please provid auther details'})
      return
    }
    //Extrct params
    const {fname, lname, title, email, password} = requestBody;

    // validation starts
    if(!isValid(fname)){
      res.status(400).send({status: false, message: 'First name is required'})
      return
    }
    if(!isValid(lname)){
      res.status(400).send({status: false, message: 'last   name is required'})
      return
    }
    if(!isValidTitle(title)){
      res.status(400).send({status: false, message: 'Tital should be among Mr, Mrs, Miss and Mast'})
      return
    }
    if(!isValid(email)){
      res.status(400).send({status: false, message: 'Email is required'})
      return
    }

    if((!( /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))){
      res.status(400).send({status: false, message: 'Email is not valid'})
      return
    }
    if(!isValid(password)){
      res.status(400).send({status: false, message: 'password is required'})
      return
    }

    const isEmailAlreadyUsed = await authorModel.findOne({email});

    if(isEmailAlreadyUsed){
      res.status(400).send({status: false, message: `${email} email address is already registered`})
      return
    }
    // Validation ends

    const authorData = {fname, lname, title, email, password}
    const newAuthor = await authorModel.create(authorData);
    
    res.status(201).send({status: true, message: `Author created successfully`, data: newAuthor});

  }catch(error){
    console.log(error)
    res.status(500).send({mas: false, date: error.message})
  }
}

const loginAuthor = async function(req,res){
  try{
    const requestBody = req.body;
    if(!isValidRequestBody(requestBody)){
      res.status(400).send({status: false, message: 'Invalid request pareameters. Please provide login details'})
      return
    }
    // Extract params
    const {email, password} = requestBody;
    // valitaion starts
    if(!isValid(email)){
      res.status(400).send({status: false, message: `Email is requred`})
      return
    }
    if(!( /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))){
      res.status(400).send({status: false, message: `Email should be a valid eamil address`})
      return
    }
    if(!isValid(password)){
      res.status(400).send({status: false, message: `password is requried`})
      return
    }
    // validation ends

    const author = await authorModel.findOne({email,password})
    if(!author){
      res.status(401).send({status: false, message: `Invalid login credentials`});
      return
    }

    const token = await jwt.sign({
      authorId: author._id,
      Aman: "aman",
      // iat: Math.floot(date.now() / 1000),
      // exp: Math.floor(date.now() / 1000) + 10*60*60,
    }, 'someverysecuredprivatekey291@(*#*(@(@()')

    res.header('x-api-key', token);
    console.log(token)
    res.status(200).send({status: true, message: `Author login successfull`, data: {token}})

  }catch(error){
    res.status(500).send({status: false, massage: error.massage})
  }
}



module.exports ={
  registerAuthor,
  loginAuthor
}