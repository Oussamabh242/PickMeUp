const express =  require("express") ;
const Pickme = require("../models/pickme.js") ;
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken"); 
const User = require("../models/user.js");

// let pipe = new Queue();

// setInterval(pipe.timeOut.bind(pipe), 10000);

//router
const router = express.Router() ;

// available pickmes
router.get("/", auth , async (req ,res)=>{
    let payload = jwt.decode(req.get("x-auth-token")) ; 
    const pickmes = await Pickme.find({valid: true , status : "pending"} , {"passenger.name" : true , from :true ,to: true, time :true,_id: false}) ;
    res.send(pickmes);
}) ;

// posted pickmes
router.get("/my", auth , async (req ,res)=>{
    let payload = jwt.decode(req.get("x-auth-token")) ; 
    const pickmes = await Pickme.find({"passenger._id":payload._id} , {"passenger.name" : true , from :true ,to: true, time :true,_id: false});
    res.send(pickmes)
}) ; 

// driver's signed for pickmes :
router.get("/driver", auth , async (req ,res) =>{
    let payload = jwt.decode(req.get("x-auth-token")) ; 
    if(!payload.driver) return res.status(403).res("you have to be a driver") ; 
    const pickmes = await Pickme.find({"driver._id":payload._id , status : "deal"} , {"passenger.name" : true , from :true ,to: true, time :true,_id: false});
    res.send(pickmes) ; 
})


router.post("/" , auth , async (req, res)=>{
    let payload = jwt.decode(req.get("x-auth-token")) ; 
    let pickme = new Pickme({
        passenger : {
            _id : payload._id,
            name: payload.name
        } ,
        from : req.body.from ,
        to :req.body.to ,
        time : new Date(req.body.time) 
    });
    pickme = await pickme.save() ; 
    // pipe.insert({
    //     _id : pickme._id ,
    //     time : pickme.time 
    // })
    res.send(pickme); 
}) ; 

// Completing Rides //
router.post("/complete" ,auth,  async (req ,res)=>{

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



//exports
module.exports = router ; 