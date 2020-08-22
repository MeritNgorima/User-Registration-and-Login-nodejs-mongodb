const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const passport = require('passport')
const bcrypt = require('bcrypt')




//load user
const User = require('../models/User')

//Connect DataBase
mongoose.connect('mongodb://localhost:27017/Students')
const db = mongoose.connection

//login
router.get('/login',(req,res)=>res.render('login'))

//register
router.get('/register',(req,res)=>res.render('register'))

//register handler
router.post('/register',(req,res)=>{
    const { name,email,password,password2 } = req.body
    let errors = []

    //check if all filds are completed
    if ( !name || !email || !password || !password2 ) {
        errors.push({ msg_fields: 'Please fill all the fields' })
    }

    //check password confirmed
    if ( password != password2 ) {
        errors.push({ msg_confirmed: 'Password is not confirmed' })
    }

    //check password length
    if ( password.length < 8 ) {
        errors.push({ msg_length: 'Password must have 8 characters' })
    }

    if (errors.length > 0) {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email:email })
        .then(user=>{
            if (user) {
                errors.push({ msg_email: 'Email is already exists' });
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }else{
                //create a new  user

                const newUser = new User({
                    name,
                    email,
                    password
                })

                //hash the password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err

                        newUser.password = hash

                        newUser.save()
                        .then(user=>{
                            req.flash('success_msg','You are now registered and can now log in')

                            db.collection('Accounts').insertOne(newUser,function(err,collection){
                                if(err) throw err
                                console.log(req.body);
                                
                            }) 

                            res.redirect('/users/login')
                        })
                        .catch(err=> console.log(err));
                    })
                })
            }
        })
    }
    


    
})

//login handler
router.post('/login',(req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboad',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

  //logout handle
  router.get('/logout',(req,res)=>{
      req.logout;
      res.redirect('/users/login')
    })


    
  
module.exports = router;