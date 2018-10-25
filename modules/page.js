var mongoose = require('mongoose');

//page schema 
var pageSchema= mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String
    },

    content: {
        type: String,
        required: true
    },

    sorting: {
        type: Number
    }


});


var page = module.exports= mongoose.model('page', pageSchema);