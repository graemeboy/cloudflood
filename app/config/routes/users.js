var express = require('express');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });
};