var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../model/userdb.js');
var crypto = require('crypto');


router.get('/', function(req, res, next) {
   
    res.sendFile('profile.html', {root: "view/"});
});

router.put('/update', function(req, res, next) {

    User.update(
      { 
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        dateofbirth:req.body.birthday,    
       
      }, function (err, user) {
        if (err) return next(err);
        res.json(user);
    });
});

router.put('/updateEmail', function(req, res, next) {

    User.update( { username:req.body.username},
      { 
        email:req.body.email    
       
      }, function (err, user) {
        if (err) return next(err);
        res.json(user);
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
        
        res.json(user);
    });
});

module.exports = router;