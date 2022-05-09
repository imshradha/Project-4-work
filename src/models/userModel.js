const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
        title:{ type: string, 
              required:true,
              enum:[Mr, Mrs, Miss]
            },
        name: {type: string, 
            required:true,
        },
        phone: {type: string, 
            required:true,
            unique:true,
        },
        email: {type: string, 
            required:true,
            unique:true,
        }, 
        password: {type: string, 
            required:true,
             minLen :8,
            maxLen :15
            },
        address: {
          street: {type: String},
          city: { type: String},
          pincode: {type: String}
        }
},{timestamps:true})

module.exports = mongoose.model("User", userSchema)