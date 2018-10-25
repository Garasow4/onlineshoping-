var mongoose = require('mongoose');

//Product schema 
var productSchema= mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },

    slug: {
        type: String
    },

    desc: {
        type: String,
        required: true
    },

    
    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String
    }


});


var product = module.exports= mongoose.model('product', productSchema);