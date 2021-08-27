const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userschema= new mongoose.Schema({
   name:{
       type:String,
       required:true,
       minlenght:3
   },
   email:{
       type:String,
       required:true,
       unique:[true, "Email already registered"],
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Invalid Email");
           }
    },
   },
   dob:{
    type:Date,
    required:true,
//     validate(value){
//         if(!validator.isDate(value)){
//             throw new error("Invalid Date");
//         }
//  },
},
password:{
    type:String,
    required:true,
    validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Invalid Password");
        }
 },
},
tokens:[{
    token:{
        type:String,
        required:true,
    }
}]
});

//schema for questions
// const questionschema=new mongoose.Schema({
//      question:
//      {type:String
//     },

//      options:[{
//        option: {
//             type:String,
//             required:true,
//         }
//     }],
//     answer:{
//         type:int
//     }
// });



//generate tokens
userschema.methods.generatetoken=async function(){
    try{
        const token=jwt.sign({_id:this._id},"ournameis19it133and19it092project");
        // console.log("jwt token sign"+token)
        this.tokens=this.tokens.concat({token})
        await this.save();
        return token;
    }catch(error){
        // res.send(error);
        console.log("Error part is"+ error);
        throw error;
    }
}



userschema.pre("save", async function(next)
{
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        console.log("Password check",this.password);
    }
    next();
  })

const User= new mongoose.model("User",userschema)
module.exports=User;