//var http=require('http');
//var url=require('url');
//var fs=require('fs');
var express = require('express');
var bodyParser=require('body-parser');
//const bcrypt=require('bcrypt-nodejs');
//const cors=require('cors');
require('dotenv').config();
//var passport = require('passport');
//var Strategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
//var Account = require('./User.model');
var app = express();
var db = 'mongodb://localhost:27017/testdb';
//var port = 3000;
mongoose.connect(db);
//var db = mongoose.connection;
/*app.listen(port,function(){
    console.log('app lstennig on port'+port);
});*/

var passport = require('passport');
//var Strategy = require('passport-facebook').Strategy;
var User = require('./User.model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Passport init 
app.use(passport.initialize());
app.use(passport.session());

// login
//vérifier le token
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(token, done) {
    User.getUserByToken(token, function(err, user){
      if(err) throw err;
      if(!user){
          //User.createUser()
        return done(null, false, {message: 'Unknown User'});
      }
   });
  }
));
////////////:
var token = bodyParser.token;
passport.serializeUser(function(user, done) {
    done(null, user.token);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getAccountByToken(token, function(err, user) {
      done(err, user);
    });
  });
////////////////

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send("hrllo from app.post /login"+req.user);
  }
);
////////:
var FacebookStrategy = require('passport-facebook').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
    passport.use(new FacebookStrategy({
        clientID: "APP_ID",
        clientSecret: "SECRET_KEY",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
          if (err) return done(err);
          if (user) return done(null, user);
          else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
      
            // set all of the facebook information in our user model
            newUser.token = profile.token;
            newUser.email = profile.email;
            newUser.name  = profile.displayName;
            if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
              newUser.email = profile.emails[0].value;
      
            // save our user to the database
            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      }));

///::
app.post('/auth/facebook',
  passport.authenticate('facebook'));

app.post('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.redirect('/');
  }
);
///////
app.listen(3000, () => console.log('App listening on port 3000!'));

/*
passport.use(new Strategy({
    clientID: '822187658147777',
    clientSecret: 'a14bea57f1c26390518a56c69a2f0714',
    callbackURL: 'http://localhost:3000/'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log('hello from server');
    return cb(null, profile);
  }));
*/

/*
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/
//////////////
/* const passport = require('passport');
passport.use(new FacebookStrategy({
    clientID: 822187658147777,
    clientSecret: "a14bea57f1c26390518a56c69a2f0714",
    callbackURL: "http://localhost:3000/login"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ token: accessToken }, function (err, user) {
      return cb(err, user);
    });
  }
));
/////////////////////////////

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});


//////////////////////
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
      UserDetails.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
  }
));

app.post('http://localhost:3000/login',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
      console.log("hello from post login");
      
    res.redirect('/success?username='+req.user.username);
  });*/