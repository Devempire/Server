var mongoose = require('mongoose');

var WidgetSchema = mongoose.Schema({
    widgetname:{type:String,unique:true},
    type:String,
    default_size:String,
    resizeable:Boolean,
    draggable:Boolean,
});

var Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;