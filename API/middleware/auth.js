const jwt = require("jsonwebtoken") ; 
module.exports = function(req , res , next){
    let token = req.get("x-auth-token") ; 
    if(!token) return res.status(400).send("authentication token required") ; 
    token = jwt.decode(token) ; 
    if(!token) return res.status(401).send("Wrong authentication token") ; 
    next() ; 
}