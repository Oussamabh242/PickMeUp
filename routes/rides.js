const express =  require("express") ;
const Pickme = require("../models/pickme.js") ;
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken"); 
const User = require("../models/user.js");
const { default: mongoose } = require("mongoose");

const router = express.Router()

// fullfilling Rides //
router.post("/fullfill" ,auth,  async (req ,res)=>{

    let payload = jwt.decode(req.get("x-auth-token")) ; 
    if(!payload.driver) return res.status(403).res("you have to be a driver") ;
    let pickme = await Pickme.findById({_id : req.body.pickmeId}) ; 
    let passenger = await User.findById({_id: pickme.passenger._id}) ; 
    let driver = await User.findById({_id: payload._id}) ;
    if (pickme.driver._id != payload._id) return res.send("the supposed to be the driver and you are not the same") ;  
    if (req.body.vCode != passenger.verificationCode) return res.status(401).send("wrong v Code") ;
    if (pickme.status != "deal" || Date.now()<pickme.time) return res.send("you either don't have a deal or you have to complete this picke me after the time") ; 
    pickme.status= "fulfilled" ; 
    await pickme.save() ;
    driver.driverInfo.rides +=1  ;
    driver = await driver.save() ; 
    res.send(driver) ; 

});

//unfullfilling rides ; 
router.post("/unfullfill" ,auth,  async (req ,res)=>{
    let payload = jwt.decode(req.get("x-auth-token") ); 
    let pickme = await Pickme.findById({_id : req.body.pickmeId}) ; 
    if (pickme.status != "deal") return res.status(400).send("you dont have a deal") ; 
    if (Date.now()>pickme.time){
        pickme = await Pickme.findByIdAndUpdate({_id : req.body.pickmeId} , {$unset : {"driver" :""} , status : "unfullfilled" }) ; 
        return res.send("ride has been unfullfilled !") ; 
    }
    res.send("unfullfilling requires that you surpass the ride's time") ; 
    
}) ; 

module.exports =router ;