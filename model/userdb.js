var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    privilege_level: {type: String, default:'0'}, //0 regular, 1 moderator, 2 admin
    firstname: String,
    lastname: String,
    username: {type: String, unique:true},
    password: String,
    email: {type: String, unique:true},
    aboutme:{type:String,default:''},
    is_verified: {type: Boolean, default: false}, //default not verrified
    verification_code: {type: String, unique:false, default: null}, //email verrification code. default blank.
    dateofbirth: {type: String, default:''},
    gameinventory:[{game: String, useringame: String, interest: Array}],
    widgets:[{widgetname: String, widgetid: String, username: String}],
    gamertype: {type: String, default: ''},
    friends: {type: Array, default: ''},
    mic: {type: Boolean, default: false }, //default no mic
    layout:{type:Array,default:[]},
    //img: {data: Buffer, contentType: String}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
