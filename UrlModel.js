const mongoose=require("mongoose")
const shortId=require("shortid")

const url=new mongoose.Schema({
 original_url:{
     type:String,
     required:true

 },
 short_url:{
     type:String,
     required:true,
     default:shortId.generate
 }
 
})
module.exports=mongoose.model("Url",url)



