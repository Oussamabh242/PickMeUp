const express = require("express") ; 
const mongoose =  require("mongoose") ; 

// Requiring Routes 
const userRoute = require("./routes/users") ; 

//app & mongoose
const app = express() ; 
mongoose.connect("mongodb://127.0.0.1:27017/PickMeUp")
    .then(()=>console.log("connected to mongodb")) 
    .catch(err => console.log(err)) ; 

//middelware : 
app.use(express.json()) ; 
app.use("/api/users" , userRoute) ; 

//routes
app.get("/" , (req ,res)=>{
    res.send("hello world") ;
}) ; 

//listener
app.listen(3000 , function(err){
    if (err) console.log(err) ; 
    console.log("listening on PORT 3000") ; 
})  ;