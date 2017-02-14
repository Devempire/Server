var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../model/userdb.js');
var crypto = require('crypto');
var fs = require('fs');

router.get('/', function(req, res, next){
	res.sendFile('login.html', {root: "view/"});

});


/* show all users (for testing only), delete if running server in real application*/
router.get('/show', function (req, res, next) {
    User.find(function (err, users) {
    if (err) return next(err);
    console.log(users);
    res.json(users);
    });
});

/* add a user */
router.post('/add', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    User.find({'username':req.body.username}, function (err, users) {
        if (err) return next(err);
        console.log(req.body.username);
        if (users[0] == null){
            new User({
                username: req.body.username,
                email: req.body.email,
                password: key,
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                dateofbirth:req.body.birthday
            }).save(function ( err, user, count ){
                if( err ) return next( err );
                res.end("Submission completed");
            });
        }else{
          res.status(400);
            return next(new Error("Invalid Username"));
        }
    });

});

/*find a user*/
router.post('/find', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    console.log(key);
    User.find({'username':req.body.username, 'password':key}, function (err, users) {
        if (err) return next(err);
        if (!(users[0] == null)){
            var token = jwt.sign(users[0], 'SecretKey', {
                expiresIn: 1440*60 // expires in 24 hours
            });

            res.send(token);
            res.end("Information found");
        }else{
          res.status(400);
            return next(new Error("Incorrect information"));
        }
    });
});

//load user with valid token 
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
                res.send(
                {
                    _id :decoded._doc._id
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

//get certerain user info
router.get('/profile/:id/info',function(req,res,next){
    User.findById(req.params.id, function(err, user){
    if (err) return next(err);
 
    res.send({
            username : user.username,
            firstname: user.firstname,
            lastname :user.lastname,
            email:user.email,
            dateofbirth: user.dateofbirth,
            gameinventory:user.gameinventory,
            img: user.img
        });
    });
});

 //update user profile
 router.put('/profile/update',function(req,res,next){
     User.update( { _id:req.body._id},
       {firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        dateofbirth:req.body.birthday   
       
       }, function (err, user) {
         if (err) return next(err);

         console.log("profile updated!");
         res.json(user);
     });
 });

//update user profile picture
// router.put('/profile/updatePic', function(req, res, next) {
//     User.update( { _id:req.body._id},
//        {
//         img:req.body.img
//        }, function (err, user) {
//          if (err) return next(err);

//          res.json(user);
//      });
// })

 // update user Email
 router.put('/profile/updateEmail',function(req,res,next){
     User.update( { _id:req.body._id},
       {
        email:req.body.email       
       
       }, function (err, user) {
         if (err) return next(err);

         console.log("email updated!");
         res.json(user);
     });
 });

 //update user password
 router.put('/profile/updatePW',function(req,res,next){
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
     User.update( { _id:req.body._id},
       {
        password:key       
       
       }, function (err, user) {
         if (err) return next(err);
         console.log("password updated!");
         res.json(user);
     });
 });

 /*check old password*/
router.post('/profile/checkold', function (req, res, next) {
    var key = crypto.pbkdf2Sync(req.body.password, 'salt', 10000, 512);
    User.find({_id:req.body._id, "password":key}, function (err, users) {
        if (err) return next(err);
        if (!(users[0] == null)){
            res.end("Information found");
        }else{
          res.status(400);
            return next(new Error("Incorrect information"));
        }
    });
});

 // add user games with interest
 router.put('/profile/addgames',function(req,res,next){
     User.update( { _id:req.body._id},
       {$push:{ gameinventory : {game:req.body.game, useringame: req.body.useringame, interest:req.body.interest}}}, function (err, user) {
         if (err) return next(err);

         console.log("game added!");
         res.json(user);
     });
 });

 // remove user games with gamename
 router.put('/profile/removegames',function(req,res,next){
     User.update( { _id:req.body._id},
       {$pull:{ gameinventory : {game:req.body.game}}}, function (err, user) {
         if (err) return next(err);

         console.log("game removed!");
         res.json(user);
     });
 });
 
 // update game info
 router.put('/profile/updategames',function(req,res,next){
     User.update( { _id:req.body._id},function(){
        console.log("too tired to work");
     })
 });

module.exports = router;