var mongoose = require('mongoose');

let Project = mongoose.model('projects')
  , User = mongoose.model('users');

module.exports = (app) =>{
  app.get('/project/:projectId', (req, res) =>{
    Project.findById(req.params.projectId, (err, data)=>{
      let result = data.users.find((item)=>{
        return item.name == req.session.username;
      });
      if(result == undefined)
      {
        res.render('notAllowed.ejs', {userInfo:req.session});
      }
      else {
        let role = result.role;
        if(data.tasks.length == 0)res.render('projectPage.ejs', {userInfo:req.session, tasks:undefined, projectName: data.name, projectId: req.params.projectId, role: role});
        else res.render('projectPage.ejs', {userInfo:req.session, tasks: data.tasks, projectName: data.name, projectId:req.params.projectId, role: role});
      }
    });
  });

  app.get('/project/:projectId/newentry', (req, res) =>{
    Project.findById(req.params.projectId, (err, data)=>{
      let result = data.users.find((item)=>{
        return item.name == req.session.username;
      });
      if(result == undefined || result.role < 1)
      {
        res.render('notAllowed.ejs', {userInfo:req.session});
      }
      else {
        res.render('newEntry.ejs',{userInfo:req.session, projectId: req.params.projectId, workers:data.users});
      }
    });
  });

  app.post('/project/:projectId/newentry', (req, res) =>{
    Project.findByIdAndUpdate(req.params.projectId, {
      $push:{
        tasks:{'assignment':req.body.assignment,
               'worker':req.body.worker}
      }
    }, (err, data)=>{
    res.end();
    });
  });

  app.get('/project/:projectId/getworkers', (req, res) =>{
    Project.findById(req.params.projectId, {users:1}, (err, data)=>{
        res.send(data.users);
      });
  });

  app.post('/project/:projectId', (req, res) => {
    let assignmentField = 'tasks.' + req.body.assignmentId + '.assignment'
      , assignmentWorker = 'tasks.' + req.body.assignmentId + '.worker';
    Project.findByIdAndUpdate(req.params.projectId, {
      $set:{
        [assignmentField]:req.body.assignment,
        [assignmentWorker]:req.body.worker
      }
    }, (err, data)=>{
    });
    res.end();
  });

  app.delete('/project/:projectId', (req, res) => {
    let assignment = 'tasks.' + req.body.assignmentId;

    Project.findByIdAndUpdate(req.params.projectId, {
      $unset:{
        [assignment]:''
      }
    }, (err, data)=>{
      Project.findByIdAndUpdate(req.params.projectId, {
        $pull:{
          'tasks':null
        }
      }, (err, data)=>{
        res.end();
      });
    });
  });

  app.get('/project/:projectId/members', (req, res)=>{
    Project.findById(req.params.projectId, (err, data)=>{
      let result = data.users.find((item)=>{
        return item.name == req.session.username;
      });
      if(result == undefined || result.role < 2)
      {
        res.render('notAllowed.ejs', {userInfo:req.session});
      }
      else {
        if(data.users.length == 0)res.render('membersPage.ejs', {userInfo:req.session, members:undefined, projectName: data.name, projectId: req.params.projectId});
        else res.render('membersPage.ejs', {userInfo:req.session, members:data.users, projectName: data.name, projectId:req.params.projectId});
      }
    });
  });

  app.post('/project/:projectId/members', (req, res)=>{
    let userRole = 'users.' + req.body.workerIndex + '.role';
    Project.findByIdAndUpdate(req.params.projectId, {
      $set:{
        [userRole]:req.body.role
      }
    }, (err, data)=>{
    });
    res.end();
  });

  app.delete('/project/:projectId/members', (req, res)=>{
    let worker = 'users.' + req.body.workerIndex;

    Project.findByIdAndUpdate(req.params.projectId, {
      $unset:{
        [worker]:''
      }
    }, (err, data)=>{
      Project.findByIdAndUpdate(req.params.projectId, {
        $pull:{
          'users':null
        }
      }, (err, data)=>{
        res.end();
      });
    });
  });

  app.get('/project/:projectId/newmember', (req, res) => {
    Project.findById(req.params.projectId, (err, data)=>{
      let result = data.users.find((item)=>{
        return item.name == req.session.username;
      });
      if(result == undefined || result.role < 2)
      {
        res.render('notAllowed.ejs', {userInfo:req.session});
      }
      else {
        res.render('newMember.ejs', {userInfo: req.session, projectId:req.params.projectId});
      }
    });
  });

  app.post('/project/:projectId/newmember', (req, res) => {
    User.find({'username':req.body.worker}, (err, data)=>{
      if(data.length == 0){
        res.send('No such user registrated');
      } else {
        Project.findById(req.params.projectId, (err, data)=>{
            let check = data.users.find((item)=>{
              return item.name == req.body.worker;
            });
            if(check == undefined){
              Project.findByIdAndUpdate(req.params.projectId, {
                $push:{
                  users:{'name':req.body.worker,
                         'role':Number(req.body.role)}
                       }
                },(err, data)=>{
                  res.send('added');
                }
              );
            }
            else {
              res.send('User already in this project');
            }
        });
      }
    });
  });

  app.get('/newproject', (req, res)=>{
    res.render('newProject.ejs', {userInfo:req.session});
  });

  app.post('/newproject', (req, res)=>{
    Project.create(
        {
          'name':req.body.projectName,
          'users':[
                    {
                      name:req.session.username,
                      role:2
                    }
                  ],
          'tasks':[]
        },
        (err, data)=>{
            res.end();
        });
  });
};
