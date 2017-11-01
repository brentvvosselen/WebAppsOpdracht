var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recipeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recipe',recipeSchema);