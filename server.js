'use strict';

// Constants
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var cluster =require('cluster');
var numCPUs =require('os').cpus().length;
var app = express();
var port = process.env.PORT || 8080;
var userRoute = require('./controllers/routeUser.js');
var profileRoute = require('./controllers/routeProfile.js');
var widgetRoute = require('./controllers/routeWidget.js');

//check cpu of ur computers and split the task
if  (cluster.isMaster)  {
    for (var i  =0; i < numCPUs;i++)
        cluster.fork();
} else {

   //AMAZON WEB SERVICES
   mongoose.connect('mongodb://localhost/db', function(err) {

		    //Rest UserDB
		    //mongoose.connection.collections['users'].drop();

        //Reset WidgetDB
        // mongoose.connection.collections['widgets'].drop();


        if(err) {
            console.log('connection error', err);
        } else {
            console.log('connection successful');
        }
    });

app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'view'), {maxAge:86400000}));


 /** Routing Modules Configuration **/
app.use('/login', userRoute);
app.use('/profile/', profileRoute);
app.use('/widget/', widgetRoute);
app.get('/about/',function(req, res){if (!req.url.endsWith('/')) {res.redirect(301, req.url + '/')}res.sendFile('about.html', {root: "./view/"});});
app.get('/team/', function(req, res){if (!req.url.endsWith('/')) {res.redirect(301, req.url + '/')}res.sendFile('team.html', {root: "./view/"});});
app.get('/privacy/', function(req, res){if (!req.url.endsWith('/')) {res.redirect(301, req.url + '/')}res.sendFile('privacy.html', {root: "./view/"});});
app.get('/terms/', function(req, res){if (!req.url.endsWith('/')) {res.redirect(301, req.url + '/')}res.sendFile('terms.html', {root: "./view/"});});
app.get('/contact/', function(req, res){if (!req.url.endsWith('/')) {res.redirect(301, req.url + '/')}res.sendFile('feedback.html', {root: "./view/"});});
app.get('/', function(req, res){res.sendFile('main.html', {root: "./view/"});});
app.use('/user',userRoute);




 //catch 404 and forward to error handler
/*
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
*/

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});


    var server = app.listen(port);
}
