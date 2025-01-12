const express=require('express');
const User = require('../models/User');
const passport = require('passport');
const router=express.Router();
//task 1 -> to show the signUp form
router.get('/register',(req,res)=>{
    res.render('auth/signup')

})

//task-2(to actually add or register the user in db)
router.post('/register',async(req,res)=>{
    let {email,password,username,role}=req.body;
    const user=new User({email,username,role})
     const newUser= await User.register(user,password);
    //  isse data show hoga user ka so insted will redirect
    // res.send(newUser)
    // res.redirect('/login')
    req.login(newUser,function(err){
        if(err){
            return next(err);
        }
        req.flash('success','welcome,you have registered successfully')
        return res.redirect('/products');

    })



})
//task-3(make route of login)
router.get('/login',(req,res)=>{
    res.render('auth/login');
})

//task-4(ab hum login ki details db se match krrenge since we use db here too so will use post request)
// so basically here we do login via db
router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    //this cb() is the function of login isse phle authenticate horha h not login
    function(req, res) {
        // console.log(req.user);
      req.flash('success','welcome back')
      res.redirect('/products');
    });

//route for logout
router.get('/logout',(req,res)=>{
    ()=>{
        req.logout();
    }
    res.redirect('/login');
})



module.exports=router;

