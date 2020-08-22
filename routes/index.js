const express = require('express');
const router = express.Router();
const passport = require('passport')
const {ensureAuthenticated} = require('../config/auth')

//welcome page
router.get('/',(req,res)=>res.render('welcome'))

//dashboad
router.get('/dashboad',ensureAuthenticated,(req,res)=> res.render('dashboad',{name:req.user.name}))





module.exports = router;