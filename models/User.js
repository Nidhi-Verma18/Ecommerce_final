//1st create schema of model named Product
const mongoose=require('mongoose')
//we require P_L_M as its given in documentation
const PassportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        required:true
    },
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
        
    ]
 

})
//provide all properties by P-L-M
userSchema.plugin(PassportLocalMongoose);



//now will create model
const User=mongoose.model('User',userSchema);

//since we created model and its schema now will export our model
//and jaha chahiye hoga vaha isse require krlenge
module.exports=User;


//now we have data so will insert our data in db for that we have insertMany()
//which accepts array so will make seed.js jisme will make dummy data