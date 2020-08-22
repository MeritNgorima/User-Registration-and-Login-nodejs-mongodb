var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var ejs = require('ejs');
var mongoose = require('mongoose');
var flash = require('express-flash')
var passport = require('passport')



var app = express();

//passport config
require('./config/passport')(passport);

//ejs
app.set('view engine','ejs')

//Connect DataBase
mongoose.connect('mongodb://localhost:27017/Students')
const db = mongoose.connection

let users = db.collection('Accounts')

db.on('error', console.log.bind(console,'Connection Error'))
db.once('open',function (callback) {
  console.log('Database Connected');
  
})

//


//static files
app.use(express.static(path.resolve(__dirname, "public")));

//BodyParser
app.use(express.urlencoded({ extended: false }))


// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
  })
);



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//flash
app.use(flash())


//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

//Server
const PORT = process.env.PORT||5000
app.listen(PORT, ()=>{
  console.log('Server started on port:'+PORT);
  
})
