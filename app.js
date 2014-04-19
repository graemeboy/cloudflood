var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , passport = require('passport');
  
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./app/config/config')
  , mongoose = require('mongoose');

db = mongoose.connect(config.db);

var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require (models_path + '/' + file)
});

require('./app/config/passport')(passport,config);

var app = express();
require('./app/config/express')(app, passport, db);
//require('./app/config/routes')(app, passport);

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app