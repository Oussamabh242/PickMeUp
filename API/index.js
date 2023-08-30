const express = require("express") ; 
const mongoose =  require("mongoose") ; 
const PickMe = require("./models/pickme.js") ; 

// Requiring Routes 
const userRouter = require("./routes/users") ; 
const pickmeRouter = require("./routes/pickmes.js");
const requestRouter = require("./routes/requests.js") ; 

//app & mongoose
const app = express() ; 
mongoose.connect("mongodb://127.0.0.1:27017/PickMeUp")
    .then(()=>console.log("connected to mongodb")) 
    .catch(err => console.log(err)) ; 

//middelware : 
app.use(express.json()) ; 
app.use("/api/users" , userRouter) ; 
app.use("/api/pickme" , pickmeRouter) ;
app.use("/api/requests" , requestRouter) ; 

//routes
app.get("/" , async (req ,res)=>{
    res.send("hello world");
}) ; 

async function edit(){
    console.log("start") ; 
        await PickMe.updateMany({time : {$lt :Date.now()} , valid : true , status : "pending" } , {valid :false}) ; 
}

setInterval(edit, 3600000); 

//listener
app.listen(3000 , function(err){
    if (err) console.log(err) ; 
    console.log("listening on PORT 3000") ; 
})  ;
