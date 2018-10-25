var express= require('express');
var path= require('path');
var mongoose = require('mongoose');
var Config = require ('./Config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var ExpressValidator = require('express-validator');
var fileUpload= require('express-fileupload');
var passport= require('passport');

//connect to the DB
mongoose.connect(Config.database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to the MONGODB');
});


//inial app

var app=express();


//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//setup public Folder
app.use(express.static(path.join(__dirname,'public')));

//set global error variable
app.locals.errors= null;

//Get Page Model

var Page= require('./modules/page');

//Get all pages to pass  to header.ejs
Page.find({}).sort({sorting: 1}).exec(function(err, pages){
  if(err){
    console.log(err);

  }else{

    app.locals.pages=pages;
    
  }
  
  });

  //Get Category Model

var Category= require('./modules/category');

//Get all categories to pass  to header.ejs
Category.find(function(err, categories){
  if(err){
    console.log(err);

  }else{

    app.locals.categories=categories;
    
  }
  
  });

// Express FileUpload Middleware
app.use(fileUpload());

// Body parser middle-ware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
 // cookie: { secure: true }
}));

// Express Validator
app.use(ExpressValidator({
  errorFormatter: function(param,msg,value){
    var namespace= param.split('.')
    , root = namespace.shift()
    ,formParam = root;
    while(namespace.length){
     formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };

  },
  customValidators: {
    isImage: function(value, filename){
      var extension = (path.extname(filename)).toLowerCase();
      switch(extension){

        case '.jpg':
         return '.jpg';
        case '.jpeg':
         return '.jpeg';
        case '.png':
         return '.png';
        case '':
         return '.jpg';
         default:
         return false;

      }
    }
  }
}));

// Express Messages middle ware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//passport config
require('./Config/passport');
//passport middle ware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.cart= req.session.cart;
  res.locals.user= req.user || null;
  next();
  
})
// set routes

var pages = require('./routes/pages.js');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var users = require('./routes/users.js');
var adminPages = require('./routes/admin_pages.js');
var admincategories = require('./routes/admin_categories.js');

var adminproducts = require('./routes/admin_products.js');
app.use('/admin/pages', adminPages);
app.use('/admin/categories', admincategories);
app.use('/admin/products', adminproducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', pages);


// start server
var port =8080;
app.listen(process.env.PORT || port,function() {

  console.log('server started on port'+ port);
});