var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../model/userdb.js');
var crypto = require('crypto');
var fs = require('fs');
var nev = require('email-verification')(mongoose);
var randtoken = require('../node_modules/email-verification/node_modules/rand-token');
var html =fs.readFileSync("./view/verifyemail.html", encoding="utf8");

//configure for profile
nev.configure({
  persistentUserModel: User,
  expirationTime: 600, // 10 minutes
  verificationURL: 'http://localhost:8080/login/email-verification/${URL}',
  transportOptions: {

        host: 'smtp.zoho.com',
        port: 465,
        auth: {
            user: 'noreply@gamempire.net',
            pass: 'gamempiredevempire'
        },
        secure: true,
        tls: {
        rejectUnauthorized: false
        }

  },
  verifyMailOptions: {
        from: 'Gamempire <noreply@gamempire.net>',
        subject: 'Welcome! Confirm your email address',
        html: html,
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
}, function(err, options) {
  if (err) {
    console.log(err);
    return;
  }

});

router.get('/', function(req, res, next) {
   
    res.sendFile('profile.html', {root: "view/"});
});

router.put('/update', function(req, res, next) {

    User.update({_id:req.body._id},
      { 
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        dateofbirth:req.body.birthday,    
       
      }, function (err, user) {
        if (err) return next(err);
        console.log(user);
        res.json(user);
    });
});

router.put('/updateEmail', function(req, res, next) {

    User.update( { username:req.body.username},
      { 
        email:req.body.email    
       
      }, function (err, user) {
        if (err) return next(err);
        console.log(user);
        res.json(user);
    });
});


//user resend emailverfi url
router.post('/resend', function (req, res, next) {
    var email = req.body.email;
    var URL = randtoken.generate(48);

    User.update({_id:req.body._id},
            {verification_code:URL,
            is_verified:false},function(err,ok){
                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        console.log(err);
                        return res.status(404).send('ERROR: sending verification email FAILED');
                        }
                res.json({
                    msg: 'An email has been sent to you. Please check it to verify your account.',
                    info: info
                });
                });
                 
            });

});

router.post('/load', function(req,res,next){

    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'SecretKey', function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                res.send({
                            _id : decoded._doc._id

                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
        
    }
    
});



router.get('/:id/info',function(req,res,next){
    User.findById(req.params.id, function(err, user){
    if (err) return next(err);
 
    res.send({username : user.username,
                            email:user.email,
                            dateofbirth: user.dateofbirth,
                            lastname:user.lastname,
                            firstname:user.firstname,
                            avatar: user.avatar,

                });
    });
})

/*find a user*/
router.post('/find', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);

    User.find({'username':req.body.username, 'password':key}, function (err, users) {
        if (err) return next(err);
        if (!(users[0] == null)){
            res.end("Information found");
        }else{
          res.status(400);
            return next(new Error("Incorrect information"));
        }
    });
});
//update pw with key
router.put('/updatePW', function(req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    User.update( { username:req.body.username},
      { 
        password:key    
       
      }, function (err, user) {
        if (err) return next(err);
        console.log(user);
        res.json(user);
    });
});

router.post("/updateAvatar",function(req,res,next){
    var id = req.body._id;

        base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/,"");
        binaryData = new Buffer(base64Data, 'base64').toString('binary');
    fs.writeFile('./view/img/avatars/'+id+'.jpg', binaryData, 'binary', function(err){
        if (err) throw err

        console.log('Image saved.');
    });

    User.update( { _id:req.body._id},
       {
            avatar: true
       }, function (err, user) {
         if (err) return next(err);

         console.log("Image URL updated!");
         res.json(user);
     });
});

module.exports = router;