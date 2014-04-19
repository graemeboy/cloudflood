var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , passport = require('passport')
  
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');
//  , mongoose = require('mongoose');

// db = mongoose.connect(config.db);

var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(funciton (file) {
  if (~file.indexOf('.js')) require (models_path + '/' + file)
});

//require('./config/passport')(passport,config);

var app = express();
require('./config/express')(app, passport, db);
require('./config/experss')(app, passport);

app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app