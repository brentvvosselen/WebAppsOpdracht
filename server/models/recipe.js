var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

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
    saves: [{type: Schema.ObjectId, ref:"User"}]
},
{timestamps: true});

module.exports = mongoose.model('Recipe',recipeSchema);