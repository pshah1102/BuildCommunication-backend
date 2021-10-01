const mongoose=require('mongoose');
const questionschema=new mongoose.Schema({
   
    options:[String],

   answer:{
       type:Number
   },
   image:{
       type:String
   }
});

const module3= new mongoose.model("module3",questionschema)
module.exports=module3;
