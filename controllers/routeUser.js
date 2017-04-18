var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var User = require('../model/userdb.js');
var crypto = require('crypto');
var fs = require('fs');
var nev = require('email-verification')(mongoose);
var randtoken = require('../node_modules/email-verification/node_modules/rand-token');
var html = fs.readFileSync("./view/verifyemail.html", encoding="utf8");

//configure for email verification
nev.configure({
  persistentUserModel: User,
  expirationTime: 600, // 10 minutes
  verificationURL: 'http://gamempire.net/login/email-verification/${URL}',
  transportOptions: {

        host: 'XXX',
        port: XXX,
        auth: {
            user:'XXX',
            pass: 'XXX'
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
    var email = req.body.email;
    var URL = randtoken.generate(48);
    User.find({'username':req.body.username}, function (err, users) {
        if (err) return next(err);
        console.log(req.body.username);
        if (users[0] == null){
            var newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: key,
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                dateofbirth:req.body.birthday,
                verification_code:URL,
            }).save(function ( err, user, count){
                 if( err ) {
                    console.log(err);
                    return;
                 }

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
        }else{
          res.status(400);
            return next(new Error("Invalid Username"));
        }
    });
});

// user accesses the link that is sent
router.get('/email-verification/:URL', function(req, res) {
  var url = req.params.URL;
  User.findOne({'verification_code':url},function (err, user){
    if (user) {
        //console.log(users);
        User.update({_id:user._id},
            {is_verified:true,verification_code:null},function(err,ok){
                 res.sendFile(
                    'confirm.html', {root: "view/"}
                );
            });
    } else {
        res.sendFile('login.html', {root: "view/"});
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

//get certain user info by id
router.get('/profile/:id/info',function(req,res,next){
    User.findById(req.params.id, function(err, user){
    if (err) return next(err);

    res.send({
            username: user.username,
            firstname: user.firstname,
            lastname:user.lastname,
            email:user.email,
            dateofbirth: user.dateofbirth,
            widgets:user.widgets,
            avatar: user.avatar,
            aboutme:user.aboutme,
            layout:user.layout,
            data:user.data,
            is_verified:user.is_verified,
            privacy: user.privacy,
            comp_specs: user.comp_specs
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

 //update user aboutme
 router.put('/profile/updateaboutme',function(req,res,next){
     User.update( { _id:req.body._id},
       {aboutme:req.body.aboutme,
       }, function (err, user) {
         if (err) return next(err);

         console.log("aboutme updated!");
         res.json(user);
     });
 });

  //update user layout
 router.put('/profile/updatelayout',function(req,res,next){
     User.update( { _id:req.body._id},
       {layout:req.body.layout,
       }, function (err, user) {
         if (err) return next(err);

         console.log("layout updated!");
         res.json(user);
     });
 });

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

 // user add games
 router.put('/profile/addwidget',function(req,res,next){
     User.update( { _id:req.body._id},
       {$push:{ widgets : {widgetid:req.body.widgetid}}}, function (err, user) {
         if (err) return next(err);

         console.log("Widget added!");
         res.json(user);
     });
 });

 // update ingame name for a game
 // router.put('/profile/updatewidget',function(req,res,next){
 //        User.update( { _id:req.body._id,"widgets.widgetid":req.body.widgetid},
 //        { $set: { "widgets.$.data" : req.body.data } }, function (err, user) {
 //         if (err) return next(err);if (err) return next(err);

 //         console.log("Widget update!");
 //         res.json(user);
 //     });
 // });

 // remove user games with gamename
 router.put('/profile/removewidget',function(req,res,next){
     User.update( { _id:req.body._id},
       {$pull:{ widgets : {widgetid:req.body.widgetid}}}, function (err, user) {
         if (err) return next(err);

         console.log("Widget removed!");
         res.json(user);
     });
 });

router.post("/profile/updateAvatar",function(req,res,next){
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

//remove user profile picture
router.put("/profile/deleteAvatar",function(req,res,next){
    User.update( { _id:req.body._id},
        {
            avatar: false
        }, function (err, user) {
            if (err) return next(err);

            console.log("Image URL updated!");
            res.json(user);
    });

    fs.unlink('./view/img/avatars/'+req.body._id+'.jpg', function(err){
        if (err) throw err

        console.log('Image removed.');
    });
});


//update data for notepad for user
router.put('/profile/dataupload',function(req,res,next){
  var ref = 'data.'+req.body.ref;
     User.update( { _id:req.body._id},
      { $set: {[ref]: req.body.data}},
       function (err, user) {
         if (err) return next(err);

         console.log("data added");
         res.json(user);
     });
 });



router.put('/profile/toggleFirstName', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.firstname": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("firstname's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleLastName', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.lastname": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("lastname's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleBirthday', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.dateofbirth": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("birthday's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleEmail', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.email": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("email's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleAboutMe', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.aboutme": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("aboutme's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleAvatar', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.avatar": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("avatar's privacy is updated");
            res.json(user);
        });
});

router.put('/profile/toggleCompSpecs', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "privacy.compspecs": req.body.privacy } },
        function (err, user) {
            if (err) return next(err);

            console.log("comp specs privacy is updated");
            res.json(user);
        });
});

router.put('/profile/saveCompSpecs', function(req,res,next) {
    User.update( { _id:req.body._id},
        { $set: { "comp_specs.cpu": req.body.cpu,
                "comp_specs.gpu": req.body.gpu,
                "comp_specs.harddrive": req.body.harddrive,
                "comp_specs.keyboard": req.body.keyboard,
                "comp_specs.mouse": req.body.mouse } },
        function (err, user) {
            if (err) return next(err);

            console.log("comp specs is updated");
            res.json(user);
        });
});

module.exports = router;
