var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var Widget = require('../model/widgetdb.js');
var fs = require('fs');


router.get('/', function(req, res, next){
	res.sendFile('admin.html', {root: "view/"});

});
/* show all widgets (for testing only), delete if running server in real application*/
router.get('/show', function (req, res, next) {
    Widget.find(function (err, widgets) {
    if (err) return next(err);
    console.log(widgets);
    res.json(widgets);
    });
});


module.exports = router;

