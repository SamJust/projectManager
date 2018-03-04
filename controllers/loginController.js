var mongoose = require('mongoose');

var User = mongoose.model('users');
var Project = mongoose.model('projects');

module.exports = (app) =>{

  app.get('/login', (req, res) => {
    res.render('login.ejs', {userInfo:req.session});
  });

  app.post('/login', (req, res) => {
    req.checkBody('username', 'nameEmpty').notEmpty();
    req.checkBody('password', 'passwordEmpty').notEmpty();

    let errors = req.validationErrors();
    if(!errors){
      User.find({'username': req.body.username,
                 'password': req.body.password},
                 {_id:1},
                 (err, data) => {
                      if(data.length > 0){
                        res.sessionAdd('username', req.body.username);
                        let projectsArr = [];
                        Project.find({'users.name':req.body.username}, {name:1, _id:1}, (err, data) =>{
                          if(err) throw err;
                          for(let key in data)
                          {
                            let projectObject = {
                              name: data[key].name,
                              id: data[key]._id
                            };
                            projectsArr.push(projectObject);
                          }
                          res.sessionAdd('projectsArray', projectsArr);
                        });
                        res.redirect('/');
                      }
                      else res.render('login', {userInfo:req.session});
                   });
      }
      else res.render('login', {userInfo:req.session});
  });

  app.get('/logof', (req, res) =>{
    res.sessionDelete('username');
    res.redirect('/');
  });
};
