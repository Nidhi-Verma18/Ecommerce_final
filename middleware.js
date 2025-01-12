const Product = require('./models/Product');
const{productSchema,reviewSchema}=require('./schema')

const validateProduct=(req,res,next)=>{
    const {name,img,price,desc}=req.body;
   const{error}= productSchema.validate({name,img,price,desc})
   if(error){
    return res.render(error);
    
   }
   next();
}

const validateReview=(req,res,next)=>{
    const {rating,comment}=req.body;
   const{error}= reviewSchema.validate({rating,comment})
   if(error){
    return res.render(error);
   }
  
   next();
}


const isLoggedIN=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','please login first');
        return res.redirect('/login');
    }
    next();

}

//make middleware for isSeller authentication
const isSeller=(req,res,next)=>{
    if(!req.user.role){
        req.flash('error','you dont have permission to do that')
        return res.redirect('/products');
    }
    else if(req.user.role!='seller'){
        req.flash('error','you dont have permission to do that')
        return res.redirect('/products');
    }
    next();

}

//will make a middleware ki agr 2 sellers hain and jisne product banaye h sirf vhi delete krskat h usse!
const isProductAuthor=async(req,res,next)=>{
    let {id}=req.params //it gives us product ki id
    let product=await Product.findById(id);
    if(!product.author.equals(req.user._id)){
        req.flash('error','you dont have permission to do that')
        return res.redirect('/products');
    }
    next()
}


module.exports={isLoggedIN,validateProduct,validateReview,isSeller,isProductAuthor}