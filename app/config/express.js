var express = require('express')
  , session = require('express-session')
  , mongoStore = require('connect-mongo')({session: session})
  , helpers = require('view-helpers')
  , pkg = require('../../package.json')
  , flash = require('connect-flash')
  , path = require('path')
  , config = require('./config');

var env = process.env.NODE_ENV || 'development'

module.exports = function (app, passport, db) {

  app.set('showStackError', true)
  
  app.locals.pretty = true;
  
  if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
  }
  
  app.use(require('compression') ({
    filter: function(req, res) {
		  return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
	  },
	  level: 9
  }));
  
  app.use(express.static(path.resolve(config.root + '/../public/')));

  // set views path, template engine and default layout
  app.set('views', config.root + '/views')
  app.set('view engine', 'ejs')
  
 // app.configure(function () {
    // expose package.json to views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      next()
    });

    // cookieParser should be above 
    app.use(require('cookie-parser')('secret'));
    
    var bodyParser = require('body-parser');
    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    
    //app.use(require('express-validator'));
    
    app.use(require('method-override')());
    
    // express/mongo session storage
    app.use(session({
      secret: config.sessionSecret,
      store: new mongoStore({
        db: db.connection.db,
        collection : config.sessionCollection
      })
    }));
    
    app.use(require('connect-flash')());

    // need to add store!

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(flash());

    // should be declared after session and flash
    app.use(helpers(config.app.name));
    
    // connect router   
   app.use(require(config.root + '/routes')(passport)); 
    
    // adds CSRF support
/*
    if (process.env.NODE_ENV !== 'test') {
      app.use(require('csurf')());

      // This could be moved to view-helpers :-)
      app.use(function(req, res, next){
        res.locals.csrf_token = req.csrfToken()
        next()
      });
    }
*/
    
    app.use(function(err, req, res, next){
		  console.error(err.stack);
      res.send(500, 'Something broke!');
    })
      
    app.use(function(req, res) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });
}
