const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGO_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  autoIndex: true
});

module.exports.User = require('./user');
module.exports.Post = require('./posts');
