const mongoose = require("mongoose") ; 

const Pickme = mongoose.model("pickme" , new mongoose.Schema({
    passenger : {
        type: new mongoose.Schema({
            name:{
                type : String ,
                required : true ,
                min : 10 ,
                max : 50
            }
        }),
        required : true
    } , 
    from : {
        type : String ,
        required : true ,
        min : 5 ,
        max : 50
    } , 
    to :{
        type : String ,
        required : true ,
        min : 5 ,
        max : 50
    } , 
    time: {
        type : Date,
        required:true
    } ,
    status :{
        type : String ,
        min : 5 ,
        max : 50,
        default : "pending"
    } ,
    driver : {
        type: new mongoose.Schema({
            driverName:{
                type : String ,
                min : 5 ,
                max : 50
            }
        })
    }, 
    valid: {
        type: Boolean , 
        default : true 
    }, 
    


}));

module.exports = Pickme