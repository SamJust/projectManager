var express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var validator = require('express-validator');

mongoose.connect('mongodb://localhost:27017/todoApp');

var mongooseSchemas = require('./mongooseSchemas.js')
var registrationController = require('./controllers/registrationController.js');
var loginController = require('./controllers/loginController.js');
var projectController = require('./controllers/projectController.js');
var profileController = require('./controllers/profileController.js');
var sessions = require('./sessions.js');
var refreshProjects = require('./refreshProjects.js');
var app = express();
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use(urlencodedParser);
app.use(validator());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use(sessions);
app.use(refreshProjects);

app.get('/', (req, res) => {
  res.render('index', {userInfo:req.session});
});

registrationController(app);
loginController(app);
projectController(app);
profileController(app);

app.listen(3000, ()=>{
  console.log('Listening to port 3000');
});
