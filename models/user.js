const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name :{
        type : String ,
        required : true , 
        min :10 ,
        max : 50 ,
    } ,
    email : {
        type : String ,
        required : true , 
        min :10 ,
        max : 50 ,
    },
    password :{
        type : String ,
        required : true , 
        min :8 ,
        max : 40 ,
    } ,
    driver :{
        type : Boolean ,
        required : true , 
        default : false
    } , 
    driverInfo :{
        type : new mongoose.Schema({
            carModel :{
                type : String ,
                required : true , 
                min :5 ,
                max : 60 ,
            } ,
            license :{
                type : String ,
                required : true , 
                min :7 ,
                max : 50 ,
            },
            votes : {
                type : [new mongoose.Schema({
                    upVote : Boolean ,
                })],
            }
        }),
    },
}) ;
const userModel = mongoose.model("user" , UserSchema) ; 

module.exports = userModel ;