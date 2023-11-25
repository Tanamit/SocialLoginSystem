const express = require('express');
const passport = require('passport');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: 'your-facebook-app-id',
    clientSecret: 'your-facebook-app-secret',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    // ตรวจสอบหรือสร้างข้อมูลผู้ใช้
    return done(null, profile);
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // ตรวจสอบหรือสร้างข้อมูลผู้ใช้
    return done(null, profile);
  }
));

// กำหนดวิธีการเก็บข้อมูลผู้ใช้ใน session
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }),
  function(req, res) {
    res.send('<script>alert("Login Successfully"); window.location="/";</script>');
  }
);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }),
  function(req, res) {
    res.send('<script>alert("Login Successfully"); window.location="/";</script>');
  }
);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
