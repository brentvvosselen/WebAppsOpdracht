var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
var Recipe = require('./recipe');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../config');

//create a schema 
var userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, required: true, unique: true, es_indexed: true},
    hash: String,
    salt: String,
    posts: [{type: Schema.ObjectId, ref: 'Recipe'}],
    saves: [{type: Schema.ObjectId, ref: 'Recipe'}],
    follows: [{type: Schema.ObjectId, ref: 'User'}],
    followers: {type: Number, required: true, default:0},
    picture: {type: Schema.ObjectId, ref: 'Image'}
});
userSchema.plugin(mongoosePaginate);

//helper functions for password
//setPassword
userSchema.methods.setPassword = function (password){
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
}
//checkPassword
userSchema.methods.validPassword = function (password){
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}
//generate jwt
userSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    //jwt gets expired after 60 days
    exp.setDate(today.getDate() + 60);
    return jwt.sign({
        _id: this._id,
        email: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, config.secret);
};

//create a model to use the schema
var User = mongoose.model('User',userSchema);

//make this available to our users in our app
module.exports = User;

