var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Recipe = require('./recipe');

//create a schema 
var userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    posts: [{type: Schema.ObjectId, ref: 'Recipe'}],
    saves: [{type: Schema.ObjectId, ref: 'Recipe'}]
});


//create a model to use the schema
var User = mongoose.model('User',userSchema);

//make this available to our users in our app
module.exports = User;