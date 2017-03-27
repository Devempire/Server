var express = require('express');
var app = express();
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../model/userdb.js');

//user1 add friend  request to user2 with id 
 router.put('/addFriend',function(req,res,next){
    User.requestFriend(res.user1, res.user2, function(friend,cb){
    	console.log(friend);
    	console.log(cb);

    	res.end("friend request send!");
    });
 });

 //user1 accept friend  request to user2 with id 
 router.put('/acceptFriend',function(req,res,next){
    User.requestFriend(res.user1, res.user2, function(friend,cb){
    	console.log(friend);
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
  	console.log(friendships);
	});
 });

 //show friendship of user1 with id 
 router.put('/removeFriend',function(req,res,next){
 	User.removeFriend(user1, user2, function(friend,cb){
    	console.log(friend);
    	console.log(cb);

    	res.end("friend deleted!");
    });
 });





module.exports = router;