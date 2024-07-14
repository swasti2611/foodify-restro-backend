
const Mealtype=require('../Models/mealtypemodel')
const getMealtype= async(req,res)=>{
    try {
        const response=await Mealtype.find({})
        res.send(response)
    } catch (error) {
        res.send(error)
    }
     
     
}
module.exports=getMealtype;