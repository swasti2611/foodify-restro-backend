
const mongoose=require('mongoose')

let authUserSchema=new mongoose.Schema({

    name:{
        type:String, 
        required:true
    },
    
    lastName:{
        type:String, 
        required:true
    },
    
    email:{
        type:String, 
        required:true,
        unique:true
    },
    
    password:{
        type:String, 
        required:true
    }

})


let user=mongoose.model("user",authUserSchema)
module.exports=user