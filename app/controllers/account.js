config = require('../config/config');
    
exports.upgrade = function(req, res, next) {
  res.render('dashboard/upgrade');
}