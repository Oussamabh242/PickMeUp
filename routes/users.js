const express =  require("express") ;
const User = require("../models/user.js") ;
const bcrypt = require("bcrypt") ; 
const jwt = require("jsonwebtoken") ; 

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
            verificationCode : req.body.vCode 
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
    res.set("x-auth-token" ,user.generateAuthToken() ) ; 
    res.send({status : "Done"}) ;
});

router.post("/auth" ,async (req,res)=>{
    const user =await User.findOne({email : req.body.email}) ; 
    if (!user) return res.status(404).send("User Not Found") ; 
    const validate = await bcrypt.compare(req.body.password , user.password) ;
    if(!validate) return res.status(403).send("wrong password") ;
    const token = user.generateAuthToken() ; 
    res.set("x-auth-token" , token) ; 
    res.send({status : "loged in"}) ;
}) ; 

router.get("/me", async (req ,res)=>{
    const token = req.get("x-auth-token") ;
    const payload = jwt.decode(token) ;
    res.send(payload) ; 
})



module.exports=router ; 