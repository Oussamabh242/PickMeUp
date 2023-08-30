const express =  require("express") ;
const Pickme = require("../models/pickme.js") ;
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken"); 
const User = require("../models/user.js");
const { default: mongoose } = require("mongoose");

// let pipe = new Queue();

// setInterval(pipe.timeOut.bind(pipe), 10000);

//router
const router = express.Router() ;

//voting

router.post("/" ,auth,  async (req ,res)=>{
    let payload = jwt.decode(req.get("x-auth-token") );
    let pickme = await Pickme.findOne({_id : req.body.pickmeId , "passenger._id":payload._id , status : "fulfilled"} ) ; 
    if (!pickme) return res.send("something wrong with your qurey") ; 
    let driver = await User.findById({_id: pickme.driver._id}) ;
    if (!req.body.vCode == driver.verificationCode) return res.send("wrong verification code") ; 
    driver.driverInfo.votes.push({
        _id: payload._id ,
        num : req.body.num ,
        pickme :new mongoose.Types.ObjectId(pickme._id)  
    }) ; 
    res.send(await driver.save()) ; 
    
}) ; 


///
module.exports =router ;