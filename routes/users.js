const express =  require("express") ;
const User = require("../models/user.js") ;
const bcrypt = require("bcrypt") ; 


//Router
const router = express.Router() ;


router.post("/" , async (req , res)=>{
    let user ; 
    if (req.body.driver===true){
        user = new User({
            name : req.body.name ,
            email : req.body.email ,
            password : req.body.password ,
            driver : true ,
            driverInfo:{
                carModel : req.body.carModel || " " ,
                license : req.body.license || " " ,
                votes : [] 
            },
        }) ;
    }
    else{
        user = new User({
            name : req.body.name ,
            email : req.body.email ,
            password : req.body.password ,
            driver : false
        }) ;
    }
    try{
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password , salt) ;
    user = await user.save() ;
    }
    catch(ex){
        console.log(ex) ; 
        return res.status(500).send("Something went wrong") ;
    }

    
    
    res.send(user) ;
});
bcrypt.compare("oussama.bh", "$2b$10$NsMkITeM2AFsJ0Ght5.tWeDgQCJ8V5xAnHDSht17JkBaGsv1pbidy")
    .then(a=>console.log(a)); 

module.exports=router ; 