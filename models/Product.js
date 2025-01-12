//1st create schema of model named Product
const mongoose=require('mongoose')
//here we require Review becoz neeche humne Review model use kiya h 
const Review = require('../models/Review');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },

    price:{
        type:Number,

    },
    img:{
        type:String
    },

    desc:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }



})

//2nd way->production wala to delete reviews
// productSchema.post('findOneAndDelete',async (product)=>{
//     if(product.reviews.length>0){
//         await Review.deleteMany({_id:{$in:product.reviews}})
//     }



// })
productSchema.post('findOneAndDelete', async (product) => {
    if (product && product.reviews && product.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: product.reviews } });
    }
});



//now will create model
const Product=mongoose.model('Product',productSchema);

//since we created model and its schema now will export our model
//and jaha chahiye hoga vaha isse require krlenge
module.exports=Product;


//now we have data so will insert our data in db for that we have insertMany()
//which accepts array so will make seed.js jisme will make dummy data