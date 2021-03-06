var mongoose = require('mongoose');
var friends = require("mongoose-friends")


var UserSchema = mongoose.Schema({
    privilege_level: {type: String, default:'0'}, //0 regular, 1 moderator, 2 admin
    firstname: String,
    lastname: String,
    username: {type: String, unique:true},
    password: String,
    avatar: {type: Boolean, default:false},
    email: {type: String, unique:true},
    aboutme:{type:String,default:''},
    is_verified: {type: Boolean, default: false}, //default not verrified
    verification_code: {type: String, unique:false, default: null}, //email verrification code. default blank.
    dateofbirth: {type: String, default:''},
    widgets:[{widgetid: String, hidden: false}],
    data:Object,
    status:{type: Object, default:{timestamp:null, status:"offline"}},
    mic: {type: Boolean, default: false}, //default no mic
    layout:{type:Object, default:{}},
    privacy: {type: Object, default: {firstname:true, lastname:true, username:false, avatar:false, email:true, aboutme:false, dateofbirth:true, compspecs:false}},
    comp_specs: {type: Object, default: {cpu:"", gpu:"", harddrive:"", ram:"", monitor:""}}
});

UserSchema.plugin(friends({pathName: "gamer"}));

var User = mongoose.model('User', UserSchema);

module.exports = User;
