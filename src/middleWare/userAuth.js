const jwt = require('jsonwebtoken')

const userAuth = async(req,res,next) =>{
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["x-Api-Key"];

        if (!token) return res.status(400).send({ status: false, massage: "token must be present" });

        let decodedToken = jwt.verify(token, "group_31_functionUp");
        if (!decodedToken){
            return res.status(400).send({ status: false, massage: "token is invalid" })
        }       
        function checkToken(exp) {
            if (Date.now() <= exp * 1000) {
              console.log(true, 'token is not expired')
              req.UserLogin = decodedToken.UserLogin
            } else { 
              console.log(false, 'token is expired') 
            }
          }

        checkToken(decodedToken.exp) 

         next()

    }catch (err) {
        console.log(err.massage)
        res.status(500).send({ status: false, massage: err.message })
    }
}
module.exports = { userAuth }