var express = require('express')
  , account = require('../controllers/account');

var router = express.Router();

router.get('/upgrade', account.upgrade);

module.exports = router;