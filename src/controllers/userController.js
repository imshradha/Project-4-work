const userModel = require('../models/userModel')
let  jwt = require("jsonwebtoken");

//-------------------------- User Register------------------------------------//

const createUser = async function(req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {
            if (!data.title) {
                return res.status(400).send({ status: false, data: "title is required" })
            }
            if (!data.name) {
                return res.status(400).send({ status: false, data: "Name is required" })
            }
            if (!data.phone) {
                return res.status(400).send({ status: false, data: "Phone No. is required" })
            }
            if (!/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(
                data.phone
            )) {
                return res.status(400).send({ status: false, message: "plz enter a valid Phone no" });
            }
            let isRegisteredphone = await userModel.find({ phone: data.phone });
            if (isRegisteredphone.length != 0) {
                return res.status(400).send({ status: false, message: "phoneNo. number already registered" });
            }
            if (!data.email) {
                return res.status(400).send({ status: false, data: "Email is required" })
            }
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
                return res.status(400).send({ status: false, data: "plz enter a valid Email" });
            }
            let isRegisteredEmail = await userModel.find({ email: data.email });
            if (isRegisteredEmail.length != 0) {
                return res.status(400).send({ status: false, message: "email id already registered" });
            }
            if (!data.password) {
                return res.status(400).send({ status: false, data: "Password is required" })
            }
            if (!data.address) {
                return res.status(400).send({ status: false, data: "address is required" })
            }
            if (!data.address.street) {
                return res.status(400).send({ status: false, data: "street Name is required" })
            }
            if (!data.address.city) {
                return res.status(400).send({ status: false, data: "City Name is required" })
            }
            if (!data.address.pincode) {
                return res.status(400).send({ status: false, data: "City Pincode is required" })
            }
            let user = req.body
            let userCreated = await userModel.create(user)
            res.status(201).send({ status: true, data: userCreated })
        } else {
            return res.status(400).send({ msg: "Bad request" });
        }
    } catch (err) {
        res.status(500).send({ status: false, err: err.message });
    }
}

//-------------------------- User Register end ------------------------------------//

//-------------------------- User login part ------------------------------------//

let loginUser = async (req, res) =>{

    try{

      let body = req.body
      let email = req.body.email
      let password = req.body.password
      let UserLogin = await userModel.findOne({email: email, password: password})

      if(Object.keys(body).length == 0){
        return res.status(400).send({status: false, massage: "Email and password is requrid"})

      } else if(!email){
        return res.status(400).send({status: false, massage: "Email requrid"})

      } else if(!password){
        return res.status(400).send({status: false, massage: "Password requrid"})
       
      } else if(!UserLogin){
        return res.status(400).send({status: false, massage: "Email and password is not correct"})
      } 

      let token = jwt.sign({
        UserLogin: UserLogin._id.toString(),
        organisation: "group_functionUp",
      },
      "group_31_functionUp",{

        expiresIn: '10m'	// expires in 24 hours

      }
      );

      res.setHeader("x-api-key", token);
      console.log(token);
      res.status(201).send({ status: true, data: {token} });         

    }catch(error){
      res.status(500).send({status: false, massage: error.massage})
    }
}

module.exports = {
      createUser,
      loginUser }

//-------------------------- User login part end ------------------------------------//


