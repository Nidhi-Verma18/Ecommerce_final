// const express=require('express');
// const router = express.Router();
// //We are using request for making an HTTP/HTTPS call to payumoney server
// const request = require('request')
// const jsSHA = require('jssha');

// const {isLoggedIN}=require('../middleware')
// const {v4:uuid}=require('uuid');
// router.post('/payment_gateway/payumoney',isLoggedIN,(req, res) => {
// req.body.txnid =uuid() //Here pass txnid and it should be different 
 
// req.body.email = req.user.email;
// req.body.firstname = req.user.username;
// //Here save all the details in pay object 
//  const pay = req.body;
// const hashString = process.env.MERCHANT_KEY //store in in different file
//  + '|' + pay.txnid
//  + '|' + pay.amount 
//  + '|' + pay.productinfo 
//  + '|' + pay.firstname 
//  + '|' + pay.email 
//  + '|' + '||||||||||'
//  + 'YOUR_MERCHANT_SALT' //store in in different file
// const sha = new jsSHA('SHA-512', "TEXT");
// sha.update(hashString);
// //Getting hashed value from sha module
//  const hash = sha.getHash("HEX");
 
//  //We have to additionally pass merchant key to API
 
// pay.key = process.env.MERCHANT_KEY //store in in different file;
//  pay.surl = 'https://localhost:8080/payment/success';
//  pay.furl = 'https://localhost:8080/payment/fail';
//  pay.hash = hash;



// //Making an HTTP/HTTPS call with request
// request.post({
//  headers: {
//  'Accept': 'application/json',
//  'Content-Type': 'application/json'
//  },
//  url: 'https://sandboxsecure.payu.in/_payment', //Testing url
//  form: pay
//  }, function (error, httpRes, body) {
// if (error) 
//  res.send(
//  {status: false, 
//  message:error.toString()
//  }
//  );
// if (httpRes.statusCode === 200) {
//  res.send(body);
//  } else if (httpRes.statusCode >= 300 && 
//  httpRes.statusCode <= 400) {
//  res.redirect(httpRes.headers.location.toString());
//  }
//  })
// });

// //  Payment Success URL:

// router.post('/payment/success', (req, res) => {
//     //Payumoney will send Success Transaction data to req body. 
//      res.send(req.body);
//     })
    
//     // Payment Failure URL:
    
//     router.post('/payment/fail', (req, res) => {
//     //Payumoney will send Fail Transaction data to req body. 
     
//      res.send(req.body);
//     })
    


// module.exports = router;




const express = require('express');
const router = express.Router();
const axios = require('axios'); // Replace deprecated `request` library
const jsSHA = require('jssha');
const { isLoggedIN } = require('../middleware');
const { v4: uuid } = require('uuid');

// Payment Gateway Route
router.post('/payment_gateway/payumoney', isLoggedIN, async (req, res) => {
    try {
        // Generate a unique transaction ID
        req.body.txnid = uuid();

        // Attach user details from the session
        if (!req.user || !req.user.email || !req.user.username) {
            return res.status(400).send({ status: false, message: "User not logged in or user data is missing." });
        }
        req.body.email = req.user.email;
        req.body.firstname = req.user.username;

        // Payment details
        const pay = req.body;

        // Create the hash string
        const hashString =
            process.env.MERCHANT_KEY +
            '|' + pay.txnid +
            '|' + pay.amount +
            '|' + pay.productinfo +
            '|' + pay.firstname +
            '|' + pay.email +
            '|' + '||||||||||' +
            process.env.MERCHANT_SALT;

        const sha = new jsSHA('SHA-512', "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");

        // Add additional required fields
        pay.key = process.env.MERCHANT_KEY;
        pay.surl = 'https://yourdomain.com/payment/success'; // Replace with live URL
        pay.furl = 'https://yourdomain.com/payment/fail'; // Replace with live URL
        pay.hash = hash;

        // Make the HTTPS call using axios
        const response = await axios.post('https://sandboxsecure.payu.in/_payment', pay, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Handle response
        if (response.status === 200) {
            res.send(response.data);
        } else if (response.status >= 300 && response.status <= 400 && response.headers.location) {
            res.redirect(response.headers.location.toString());
        } else {
            res.status(response.status).send({ status: false, message: "Unexpected response from PayUMoney." });
        }
    } catch (error) {
        console.error("Payment gateway error:", error.message);
        res.status(500).send({ status: false, message: error.message });
    }
});

// Payment Success URL
router.post('/payment/success', (req, res) => {
    // PayUMoney will send success transaction data in req.body
    res.send(req.body);
});

// Payment Failure URL
router.post('/payment/fail', (req, res) => {
    // PayUMoney will send failure transaction data in req.body
    res.send(req.body);
});

module.exports = router;
