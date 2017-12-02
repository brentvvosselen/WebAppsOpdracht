var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
var Image = require('./image');

var recipeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    likes: [{type: Schema.ObjectId, ref:"User"}],
    saves: [{type: Schema.ObjectId, ref:"User"}],
    picture: {type: Schema.ObjectId, ref: 'Image'}
},
{timestamps: true});

module.exports = mongoose.model('Recipe',recipeSchema);