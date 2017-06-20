
var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
    Name:{type:String,unique:true},
    Value:[],
    Detail:String,

});

var Category = mongoose.model('Category', CategorySchema);

module.exports = Category;