var mongoose = require('mongoose');

var WidgetSchema = mongoose.Schema({
    widgetname:{type:String,unique:true},
    type:String,
    initial_width:String,
    initial_height:String,
    min_width:String,
    min_height:String,
    max_width:String,
    max_height:String,
    resizeable:Boolean,
    draggable:Boolean,
});

var Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;