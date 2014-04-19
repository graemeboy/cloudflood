var express = require('express')
  //, mongoStore = require('connect-mongo')(express)
  , helpers = require('view-helpers')
  , pkg = require('../../package.json')
  , flash = require('connect-flash')
  , config = require('./config')

//var env = process.env.NODE_ENV || 'development'

module.exports = function (app, passport, db) {

  app.set('showStackError', true)
  
  app.locals.pretty = true;
  
  /*
app.use(express.compress({
	  filter: function(req, res) {
		  return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
	  },
	  level:9
  }));
  
  if (process.env.NODE_ENV === 'development') {
	  app.use(express.logger('dev'));
  }
*/

  // should be placed before express.static
  //app.use(require('less-middleware')(config.root + '/public'));

  //app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'ejs')

 // app.configure(function () {
    // expose package.json to views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      next()
    });

    // cookieParser should be above session
    var cookieParser = require('cookie-parser')
      , bodyParser = require('body-parser')
      , methodOverride = require ('method-override');
    
    app.use(cookieParser('secret'));
    app.use(function(req, res, next) {
      res.end(JSON.stringify(req.cookies));
    })
    
    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(function (req, res, next) {
      console.log(req.body)
      next();
    })

    // bodyParser should be above methodOverride
    app.use(methodOverride());

    // express/mongo session storage
    /*
app.use(express.session({
      secret: config.sessionSecret,
      store: new mongoStore({
        db: db.connection.db,
        collection : config.sessionCollection
      })
    }));
*/

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(flash());

    // should be declared after session and flash
    app.use(helpers(config.app.name));
    //app.use(app.router)
    
    // NOT SURE IF THIS IS THE WRITE WAY TO DO THIS
   // app.use(app.router());

    // adds CSRF support
    var csrf = require('csurf');
    if (process.env.NODE_ENV !== 'test') {
      app.use(csrf());

      // This could be moved to view-helpers :-)
      app.use(function(req, res, next){
        res.locals.csrf_token = req.csrfToken()
        next()
      });
    }
    
    
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
 // })
}