//1st create schema of model named Product
const mongoose=require('mongoose')
const reviewSchema=new mongoose.Schema({
   rating:{
    type:String,
    min:0,
    max:5
   },

   comment:{
    type:String,
    trim:true
   }


},{timestamps:true})



//now will create model
const Review=mongoose.model('Review',reviewSchema);

//since we created model and its schema now will export our model
//and jaha chahiye hoga vaha isse require krlenge
module.exports=Review;


//now we have data so will insert our data in db for that we have insertMany()
//which accepts array so will make seed.js jisme will make dummy data