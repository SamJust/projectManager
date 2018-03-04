var mongoose = require('mongoose');

var User = mongoose.model('users');

module.exports = (app) =>{

  app.get('/registration', (req, res) => {
    res.render('registration.ejs', {errors:{}, userInfo:req.session});
  });

  app.post('/registration', (req, res) =>{

    let regErrors ={
    };

    req.checkBody('username', 'nameEmpty').notEmpty();
    req.checkBody('password', 'passwordEmpty').notEmpty();
    req.checkBody('password', 'passwordDontMatch').equals(req.body.passwordRepeat);
    req.checkBody('email', 'notEmail').isEmail();

    User.find({$or:[{'username':req.body.username}, {'email':req.body.email}]}, (err, data)=>{
      console.log(data);
      if(data.length != 0){
        data.forEach((item, i, arr)=>{
          if(item.username == req.body.username){
            regErrors.username = 'loginExists';
          }
          if(item.email == req.body.email){
            regErrors.email = 'emailTaken';
          }
        });

      }
      let errors = req.validationErrors();

      if(errors){
        for(key in errors){
          if(errors[key].param == 'username')
          {
            regErrors.username = errors[key].msg;
          }
          if(errors[key].param == 'password')
          {
            regErrors.password = errors[key].msg;
          }
          if(errors[key].param == 'email')
          {
            regErrors.email = errors[key].msg;
          }
        }
      }
      if(Object.keys(regErrors).length === 0 && regErrors.constructor === Object)
      {
        User.create({'username': req.body.username,
                     'password': req.body.password,
                     'email': req.body.email});
        res.redirect('/');
      }
      else{
        res.render('registration', {errors: regErrors, userInfo:req.session})
      }
    });
  });
};
