const express=require('express');
const Product= require('../models/Product');
const Review = require('../models/Review');
const router=express.Router();

const{validateProduct,isLoggedIN,isSeller,isProductAuthor}=require('../middleware');


//task 1
router.get('/products',isLoggedIN,async(req,res)=>{
    try{
   let products=await Product.find({});
    res.render('products/index',{products})
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
    
})

// task 2
router.get('/product/new',isLoggedIN,(req,res)=>{
    try{
    res.render('products/new');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }

})

//task 3-> to actually add a product in db
//validateProduct middleware we get from upar se destructure krke
router.post('/products',validateProduct,isLoggedIN,isSeller,async(req,res)=>{
    try{
    let{name,img,price,desc}=req.body;
    await Product.create({name,img,price,desc,author:req.user._id})
    req.flash('success','Product added successfully');
    res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
})

//task 4-> show a particular product
//yahi pe hamara review bhi redirect hoga tho flash bhi fir yahi pe redirect krenge

router.get('/products/:id',isLoggedIN,async(req,res)=>{
    try{
    let {id}=req.params;
   let foundProduct= await Product.findById(id).populate('reviews');
   res.render('products/show',{foundProduct,msg:req.flash('msg')});
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
})

//task-5 show edited form of particular product
router.get('/products/:id/edit',isLoggedIN,async(req,res)=>{
    try{
    let {id}=req.params;
    let foundProduct= await Product.findById(id);
    res.render('products/edit',{foundProduct});
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
})

//task 6->to actually edit product in db
router.patch('/products/:id',validateProduct,isLoggedIN,async(req,res)=>{
    try{
    let {id}=req.params;
    let {name,img,price,desc}=req.body;
    await Product.findByIdAndUpdate(id,{name,img,price,desc})
    req.flash('success','Product edited successfully');
    res.redirect(`/products/${id}`)
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
})

//task-7(to delete a particular product)
router.delete('/products/:id',isLoggedIN,isProductAuthor,async(req,res)=>{
    try{
    let {id}=req.params;

    //  1st way to delete reviews which is not ideal for production

    const product=await Product.findById(id);
    // for(let id of product.reviews){
    //     await Review.findByIdAndDelete(id);
    // }

    //2nd way->production wala



    await Product.findByIdAndDelete(id);
    req.flash('success','Product deleted successfully');
    res.redirect('/products');
    }
    catch(e){
        res.status(500).render('error',{err:e.message});

    }
})

module.exports=router;

