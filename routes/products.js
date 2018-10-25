var express = require('express')
var router = express.Router();
var fs = require('fs-extra');
//Get product Model
var Product = require ('../modules/product');
var Category = require ('../modules/category');
//Get all products
router.get('/', function(req,res){
  Product.find(function(err, products){
    if(err) 
    console.log(err);
  
      res.render('all_products',{
            
        title:'All products',
        products: products
     });
  
    
        });
     

 
});

//Get products by category
router.get('/:category', function(req,res){
var categorySlug= req.params.category;
  Category.findOne({slug: categorySlug}, function(err,c){

    Product.find({category:categorySlug},function(err, products){
      if(err) 
      console.log(err);
    
        res.render('cat_products',{
              
          title: c.title,
          products: products
       });
    
      
          });
  });

     

 
});



//Get products details
router.get('/:category/:product', function(req,res){
 
       
  var galleryImages=null;
  Product.findOne({slug: req.params.product}, function(err, product){
if(err){

  console.log(err);

}else{
  var galleryDir= 'public/product_images/' + product._id + '/gallery';
  fs.readdir(galleryDir, function(err,files){
if(err){

  console.log(err);

}else{

  galleryImages = files;
  res.render('product', {
title:product.title,
p: product,
galleryImages: galleryImages
  });
}


  });

}
  });
   
  });
//exports
module.exports=router;