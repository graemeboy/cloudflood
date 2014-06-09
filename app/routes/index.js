var express = require('express');

/**
 * Controllers
 */

var user = require('../controllers/user'),
    index = require('../controllers/');
//, auth = require('./middlewares/authorization')

module.exports = function (passport) {
    var router = express.Router();

    router.get('/logout', user.logout);
    router.post('/process-login', passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: 'Invalid email or password.'
    }), user.session);
    router.post('/process-signup', user.create);


    router.use('/dashboard', require('./dashboard'));
    router.use('/campaign', require('./campaign'));

    // Make a landing page for beta

    router.get('/try', index.beta);
    router.get('/', index.index);
    
    router.get('/vip', index.vip);

    return router;
} // exports