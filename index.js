//env file
const dotenv=require('dotenv');
dotenv.config();

const express=require('express');
let app=express();

const ejsMate=require('ejs-mate')

const path=require('path');
const seedDb=require('./seed');

//require connect-flash and express-session
const flash=require('connect-flash')
const session=require('express-session')


//require P-L-M for hashing
const PassportLocalMongoose=require('passport-local-mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local');
//require user model
const User=require('./models/User');
// session middleware
const configSession={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    
  }
app.use(session(configSession))

//PAASPORT
//1st will initialse our passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//ab hum apne session ko serialise and deserialise krenge
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const methodOverride=require('method-override')
app.use(methodOverride('_method'))
app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }))



//middleware of connect-flash

app.use(flash());



//self made middleware for locals-> locals means jinhe hum kahi se bhi access krskte hain!
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})



// now my server is connected to db
//so my db is ready
const mongoose = require('mongoose');

const dbURL=process.env.dbURL || 'mongodb://localhost:27017/test'
// 'mongodb://127.0.0.1:27017/test'
mongoose.connect(dbURL)
.then(()=>{
    console.log("db is connected")
})
.catch((err)=>{
    console.log("db is not connected")
    console.log(err);
})

// seedDb();

//now make collections or model in order to insert something in db
//before making model will make schema 
//since a db can have multile collections or models so i will make separate folder of models


//here i require my routes
const productRoutes=require('./routes/product');
const reviewRoutes=require('./routes/review');
const authRoutes=require('./routes/auth');
const cartRoutes=require('./routes/cart');
const paymentRoutes = require('./routes/payment'); // Import payment routes

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(paymentRoutes); // Register the routes


const PORT=process.env.PORT;
app.listen(8080,()=>{
    console.log("server connected at 8080 port")
})