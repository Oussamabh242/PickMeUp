const express= require("express") ;
const Request= require("../models/request.js") ; ; 
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken") ; 
const Pickme = require("../models/pickme.js");

const router = express.Router() ; 


//////
router.post("/" ,auth ,  async (req, res)=>{
    const payload = jwt.decode(req.get("x-auth-token")) ; 
    if(payload.driver === false) return res.status(403).send("you must be a driver to send a request");
    const pickme = await Pickme.findById({_id : req.body.pickmeId})  ;
    if(payload._id == pickme.passenger._id) return res.status(403).send("you cant send a request to yourself") ;
    const request = new Request({
        sender :{
            _id: payload._id,
            name : payload.name
        }, 
        reciver:{
            _id : pickme.passenger._id ,
            name: pickme.passenger.name
        } ,
        pickmeInfo : {
            from : pickme.from , 
            to : pickme.to , 
            time : pickme.time
        } ,
        offer : req.body.offer ,
    }) ; 
    res.send(await request.save()) ; 

}); 





module.exports = router ; 