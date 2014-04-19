var express = require('express');

/* GET home page. */

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });
}


//module.exports = router;
