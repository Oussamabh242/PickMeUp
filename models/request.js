const mongoose = require("mongoose") ; 

let Request = mongoose.model('request' , new mongoose.Schema({
    sender : new mongoose.Schema({
        name : {
            type:String, 
            required : true , 
            min : 5 , 
            max : 60
        }
    }),
    reciver : new mongoose.Schema({
        name : {
            type:String, 
            required : true , 
            min : 5 , 
            max : 60
        }
    }),   
    pickmeInfo : new mongoose.Schema({
        from : {
            type:String, 
            required : true , 
            min : 5 , 
            max : 60
        } , 
        to: {
            type:String, 
            required : true , 
            min : 5 , 
            max : 60
        } ,
        time : {
            type:Date, 
            required : true , 
        } 
    }) ,
    offer : {
        type:String, 
        required : true , 
        min : 2 , 
        max : 250
    } ,
    status :{
        type :String  , 
        default : "pending"
    }
}));
module.exports = Request ; 