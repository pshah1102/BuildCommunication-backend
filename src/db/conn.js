const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/users-api",{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("DB Connection is successful");
})
.catch((e) => {
   console.log("DB Connection failed");
});