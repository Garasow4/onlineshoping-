var express = require('express')
var router = express.Router();
//Get category Model
var Category = require ('../modules/category')

//Get Category Index
router.get('/', function(req,res){

    Category.find(function(err, categories){

    if(err) return console.log(err);
    
res.render('admin/categories', {

  categories:categories
});

});

});

//Get add Category
router.get('/add-category', function(req,res){
    
    var title="";
    

     res.render('admin/add_category',{

        title:title
       
    })
    });

//Post add Category
router.post('/add-category', function(req,res){
    
    req.checkBody('title', 'Title Must Have Value').notEmpty();
      var title= req.body.title;
    var slug= title.replace(/\s+/g, '-').toLowerCase();
    
    var errors=req.validationErrors();
    if(errors) {

        console.log('errors')
        res.render('admin/add_category',{
          errors: errors,
            title:title
           
        });

    } else {
        Category.findOne({slug: slug}, function(err, category) {
            if(category) {
                req.flash('danger', 'category title is exist, choose another.');  
                 res.render('admin/add_category',{
                      title:title
                      
                  });
            } else {
                var category = new Category({
                    title:title,
                    slug:slug
                   
                });
                category.save(function(err){

                    if(err) return console.log(err);

                    Category.find(function(err, categories){
                        if(err){
                          console.log(err);
                      
                        }else{
                      
                          req.app.locals.categories=categories;
                          
                        }
                        
                        });
                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
    

    
    });
  
//Get Edit Category

router.get('/edit-category/:id', function(req,res){
    
    Category.findById(req.params.id, function(err,category){

    if(err) return console.log(err);
    res.render('admin/edit_category',{

        title:category.title,
        id: category._id
    });

    }); 

    
    });
 
//Post Edit Category

router.post('/edit-category/:id', function(req,res){
    
    req.checkBody('title', 'Title Must Have Value').notEmpty();
    
    var title= req.body.title;
    var slug= title.replace(/\s+/g, '-').toLowerCase();
   
    var id= req.params.id;
    var errors=req.validationErrors();
    if(errors) {

        console.log('errors')
        res.render('admin/edit_category',{
          errors: errors,
            title:title,
            id: id

        });

    } else {
        Category.findOne({slug: slug, _id:{'$ne':id}}, function(err,category) {
            if(category) {
                req.flash('danger', 'Category title is exist, choose another.');  
                 res.render('admin/edit_category',{
                      title:title,
                      id: id
                  });
            } else {
               Category.findById(id, function(err,category){
                   if(err) return console.log(err);
            
               category.title=title;
               category.slug=slug;
              
            category.save(function(err){

                if(err) return console.log(err);
                Category.find(function(err, categories){
                    if(err){
                      console.log(err);
                  
                    }else{
                  
                      req.app.locals.categories=categories;
                      
                    }
                    
                    });
              req.flash('success', 'Category updated!');
            res.redirect('/admin/categories/edit-category/'+id);
      });
               });
        
            }
        });
    }
    

    
    });

//Get delete Category
router.get('/delete-category/:id', function(req,res){
 Category.findByIdAndRemove(req.params.id, function(err){
    if(err) return console.log(err);
    Category.find(function(err, categories){
        if(err){
          console.log(err);
      
        }else{
      
          req.app.locals.categories=categories;
          
        }
        
        });
    req.flash('success', 'Category deleted!');
    res.redirect('/admin/categories/');

 });
    
    });
//exports
module.exports=router;