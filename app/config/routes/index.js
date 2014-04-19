var express = require('express');

/**
 * Controllers
 */

//var user = require('../../app/controllers/user')
// , index = require('../../app/controllers/index');
  //, auth = require('./middlewares/authorization')

var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});


module.exports = router;