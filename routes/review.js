const express=require('express');
const Product= require('../models/Product');
const Review= require('../models/Review');
const router=express.Router();

const{validateReview}=require('../middleware');

router.post('/products/:id/review',validateReview,async(req,res)=>{
    // console.log(req.body);
    // res.send("its my review route")

try{
    let {id}=req.params;
    const product=await Product.findById(id);

    let{rating,comment}=req.body;
    const review=new Review({rating,comment});

    product.reviews.push(review);

    await review.save();
    await product.save();
    req.flash('success','Review added successfully');
    res.redirect(`/products/${id}`);
}

catch(e){
        res.status(500).render('error',{err:e.message});

}

})

//review route to delete a particular eview

router.post('/products/:id/review/:reviewId/delete', async (req, res) => {
    try {
      const { id, reviewId } = req.params;
      const product = await Product.findById(id);
  
      // Remove the review from the product's reviews
      product.reviews = product.reviews.filter(review => review._id.toString() !== reviewId);
  
      // Delete the review
      await Review.findByIdAndDelete(reviewId);
      await product.save();
  
      req.flash('success', 'Review deleted successfully');
      res.redirect(`/products/${id}`);
    } catch (e) {
      res.status(500).render('error', { err: e.message });
    }
  });
  




module.exports=router;

