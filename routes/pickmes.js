const express =  require("express") ;
const Pickme = require("../models/pickme.js") ;
const auth = require("../middleware/auth.js") ; 
const jwt = require("jsonwebtoken"); 
const Queue = require("../pipeline.js") ; 

// let pipe = new Queue();

// setInterval(pipe.timeOut.bind(pipe), 10000);

//router
const router = express.Router() ;

//
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
})


//exports
module.exports = router