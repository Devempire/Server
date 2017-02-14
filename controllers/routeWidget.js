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

router.post('/add', function (req, res, next) {
	Widget.find({'widgetname':req.body.widgetname}, function (err, widgets) {
        if (err) return next(err);
        if (widgets[0] == null){
            new Widget({
                widgetname: req.body.widgetname,
                type: req.body.type,
                default_size: req.body.default_size,
                resizeable:req.body.resizeable,
                draggable:req.body.draggable
            }).save(function ( err, widget, count ){
                if( err ) return next( err );
                res.end("Submission Completed");
            });
        }else{
          res.status(400);
            return next(new Error("Invalid Widget Name"));
        }
    });
});

router.delete('/remove', function (req, res, next) {
    Widget.findById(req.body._id, function(err, widget) {
        if (err) {
            res.status(400);
            return next(new Error("Widget not found"));
        } else {
            widget.remove(function(err) {
                if (err) {
                    res.status(500);
                    return next(new Error("Server error"));
                }
            });
        }
    });
});


module.exports = router;
