var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , User = mongoose.model('User')
  , twitterAPI = require('node-twitter-api');
  
module.exports = function (passport, config) {

  var twitter = new twitterAPI({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callback: config.twitter.callbackURL
  });


  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
    /*
User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
*/
  })
  
  passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));
    
    passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      console.log('authenticated with twitter!');
      
      twitter.statuses("update", {
        status: "Hello world!"
      },
      token,
      tokenSecret,
      function(error, data, response) {
        if (error) {
            console.log(error);
        } 
        else {
            console.log(data);
        }
      });
      //console.log(campaign);
     return done(null, {});
    }
  ));
  
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      
      console.log(accessToken);
      
      
      return done(err);
    }
  ));}
