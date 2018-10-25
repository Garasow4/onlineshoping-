var express = require('express')
var router = express.Router();
var passport = require('passport');
var bcrypt= require('bcryptjs');

//Get  users Model
var User = require ('../modules/user');

//Get Register
router.get('/register', function(req,res){
res.render('register', {
title: 'Register'
});
});

//Post Register
router.post('/register', function(req,res){
var name= req.body.name;
var email= req.body.email;
var username= req.body.username;
var password= req.body.password;
var password2= req.body.password2;

req.checkBody('name', 'Name is required!').notEmpty();
req.checkBody('email', 'Email is required!').isEmail();
req.checkBody('username', 'Username is required!').notEmpty();
req.checkBody('password', 'Password is required!').notEmpty();
req.checkBody('password2', 'Password do not match!').equals(password);

var errors = req.validationErrors();
if(errors){
  res.render('register', {
    errors:errors,
    title: 'Register'
    });
} else{
  User.findOne({username:username}, function(err,user){
    if(err) console.log(err);

if(user){
  req.flash('danger','Username is exist choose another!');
  res.redirect('/users/register');

}else{
  var user = new User({

    name:name,
    email:email,
    username:username,
    password:password,
    admin:0
  });
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(user.password, salt, function(err, hash){

      if(err) console.log(err);
      user.password= hash;
      user.save(function(err){

        if(err){
          console.log(err);

        }else{
          req.flash('success','You are now registered.');
  res.redirect('/users/login');
        }
      });
    });
  });
}
  });
}

  });
  
//Get Login
router.get('/login', function(req,res){
  if(res.locals.user) res.redirect('/');

  res.render('login', {
  title: 'Log in'
  });
  });



  //Post Login
router.post('/login', function(req,res, next){
 
  passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }) (req, res, next);
});

//exports
module.exports=router;