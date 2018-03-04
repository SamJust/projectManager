let mongoose = require('mongoose');
let Project = mongoose.model('projects');

module.exports = (req, res, next) => {
  let projectsArr = [];
  Project.find({'users.name':req.session.username}, {name:1, _id:1}, (err, data) =>{
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
    return next();
  });
};
