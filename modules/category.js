var mongoose = require('mongoose');

//Category schema 
var categorySchema= mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String
    },



});


var Category = module.exports= mongoose.model('category', categorySchema);