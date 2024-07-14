
const mongoose=require("mongoose")

const mealtypeSchema=new mongoose.Schema({
 name:{
   type:"string" 
 },
 city_id:{
    type:Number
 },

city:{
type:"string"
},
 country_name:{
type:"string"
 }
})

module.exports  =mongoose.model('mealtypes', mealtypeSchema,'mealtypes');


