var express = require('express')
  , auth = require('../config/authentication')
  , account = require('../controllers/account');

var router = express.Router();

router.get('/upgrade', auth.requiresLogin, account.upgrade);

module.exports = router;
