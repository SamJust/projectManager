var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  id: Number
});

mongoose.model('users', userSchema);

var projectSchema = new mongoose.Schema({
  name: String,
  users: Array,
  tasks: Array
});

mongoose.model('projects', projectSchema);

var sesionsSchema = new mongoose.Schema({
  sessions: Object
});

mongoose.model('sessions', sesionsSchema);
