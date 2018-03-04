var mongoose = require('mongoose');

var User = mongoose.model('users');
var Project = mongoose.model('projects');

module.exports = (app) =>{
  app.get('/profile', (req, res)=>{
    User.find({username:req.session.username}, (err, data)=>{
      res.render('profilePage.ejs', {userInfo:req.session, email:data[0].email});
    });
  });
};
