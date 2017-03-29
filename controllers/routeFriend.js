var express = require('express');
var app = express();
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../model/userdb.js');

//user1 add friend  request to user2 with id 
 router.put('/addFriend',function(req,res,next){
    User.requestFriend(req.body.user1, req.body.user2, function(friend,cb){
    		
    	console.log(cb);

    	res.end("friend request send!");
    });
 });

 //user1 accept friend  request to user2 with id 
 router.put('/acceptFriend',function(req,res,next){
    User.requestFriend(req.body.user1, req.body.user2, function(friend,cb){
 
    	console.log(cb);

    	res.end("friend request accept!");
    });
 });

 //show friendship of user1 with id 
 router.get('/:id/show',function(req,res,next){
 	var user1 = req.params.id;
 	User.getFriends(user1, function (err, friendships) {
  // friendships looks like:
  // [{status: "requested", added: <Date added>, friend: user2}]
  	//console.log(friendships);
  	res.send(friendships);
	});
 });


 //get certain user info by username
router.post('/info',function(req,res,next){
    User.find({'username':req.body.username}, function(err, user){
    if (err) return next(err);
    res.send({_id:user[0]._id});
    });
});

 //show friendship of user1 with id 
 router.put('/removeFriend',function(req,res,next){
 	User.removeFriend(req.body.user2, req.body.user1, function(friend,cb){
    	
    	console.log(cb);

    	res.end("friend deleted!");
    });
 });





module.exports = router;