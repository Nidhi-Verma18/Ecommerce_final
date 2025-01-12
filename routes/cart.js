const express=require('express');
const { isLoggedIN } = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User');
const router=express.Router();

//get route to display or see the cart
router.get('/user/cart',isLoggedIN,async(req,res)=>{
  let user=await User.findById(req.user._id).populate('cart');
  const totalAmount=user.cart.reduce((sum,curr)=>sum + curr.price,0)
  const productInfo=user.cart.map((p)=>p.desc).join('.');
    res.render('cart/cart',{user,totalAmount,productInfo})
})

router.post('/user/:productId/add',isLoggedIN,async(req,res)=>{
    //now will find product ki id to find our product similarly do for user
    let {productId}=req.params;

    //for user
    let userId=req.user._id;

    let product=await Product.findById(productId)

    
    let user=await User.findById(userId)
  //here user is our current user
    user.cart.push(product);
    await user.save();

    res.redirect('/user/cart');

})

// to delete a product from your cart

router.post('/user/:productId/delete', isLoggedIN, async (req, res) => {
  const { productId } = req.params; // Extract product ID from the URL
  const userId = req.user._id; // Get the current user's ID

  // Find the user
  let user = await User.findById(userId);

  // Remove the product from the user's cart
  user.cart = user.cart.filter(product => product._id.toString() !== productId);

  // Save the updated user data
  await user.save();

  res.redirect('/user/cart'); // Redirect back to the cart page
});





module.exports=router;