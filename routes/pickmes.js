const express =  require("express") ;
const Pickme = require("../models/pickme.js") ;

//router
const router = express.Router() ;

//
router.post("/" , async (req, res)=>{
    let pickme = new Pickme({
        passenger : {
            _id : req.body.pid,
            name: req.body.pname
        } ,
        from : req.body.from ,
        to :req.body.to ,
        time : new Date(req.body.time) 
        
    });
    res.send(await pickme.save()); 
})


//exports
module.exports = router