const location=require('../Models/location')
const getLocation= async(req,res)=>{
    try {
        const response=await location.find({})
        res.send(response)
    } catch (error) {
        res.send(error)
    }
     
     
}
module.exports=getLocation