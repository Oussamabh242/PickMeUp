const express= require("express") ;
const Request= require("../models/request.js") ; ; 
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken") ; 
const Pickme = require("../models/pickme.js");

const router = express.Router() ; 


//////
router.get("/" ,auth ,  async (req, res)=>{
    const payload = jwt.decode(req.get("x-auth-token")) ; 
    let requests = await Request.find({"reciver._id": payload._id}) ;
    res.send(requests) ; 
}) ;

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
            time : pickme.time,
            _id : pickme._id 
        } ,
        offer : req.body.offer ,
    }) ; 
    res.send(await request.save()) ; 

}); 

//acepting OR refusing requests : 
router.post("/respond" ,auth ,  async (req, res)=>{
    const payload = jwt.decode(req.get("x-auth-token")) ;
    let request = await Request.findById(req.body.requestId) ; 
    if(!(req.body.response =="accept" || req.body.response =="reject"))
        return res.send("your response should be either accept or reject") ;
    request.status = (req.body.response)+"ed" ;
    request.valid = false ; 
    request = await request.save() ; 
    if(request.status == "accepted"){
        try{
            await Pickme.findByIdAndUpdate({_id : request.pickmeInfo._id} , 
                {status : "deal" , valid: false , "driver._id" :request.sender._id , 
                "driver.driverName" :request.sender.name }) ; 
        }
        catch(ex){
            console.log(ex)
        }
    }
    res.send(request) ; 

}) ; 




module.exports = router ; 