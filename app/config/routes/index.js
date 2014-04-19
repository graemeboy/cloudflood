var express = require('express');

/**
 * Controllers
 */

var user = require('../../../app/controllers/user')
  , index = require('../../../app/controllers/');
  //, auth = require('./middlewares/authorization')

var router = express.Router();

router.get('/logout', user.logout);
router.post('/process-signup', user.create);
router.get('/dashboard', function (req, res) {
  res.render('dashboard');
});



router.get('/', index.index);

module.exports = router;