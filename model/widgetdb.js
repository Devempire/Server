
var mongoose = require('mongoose');

var WidgetSchema = mongoose.Schema({
    widgetname:{type:String,unique:true},
    widgettype:String,
    w:Number,
    h:Number,
    x:Number,
    y:Number,
    minH:Number,
    maxH:Number,
    minW:Number,
    maxW:Number,
    resizeable:Boolean,
    draggable:Boolean,
});

var Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;