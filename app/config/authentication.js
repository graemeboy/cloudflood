/*
 *  Generic require login routing middleware
 */
 
exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/')
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.campaign.user != req.user.id) {
      return res.redirect('/')
    }
    next()
  }
}