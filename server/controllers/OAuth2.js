// const AuthyAPIKey = require('../config/Authy.js');
// const authy = require('authy');
/* passport.js */
const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;
// const BearStrategy = require('passport-http-bearer');
const slackKeys = require('../config/SlackOAuth2ApiKey.js');
const User = require('../models/UserSchema.js');
// const session = require('express-session');
// const OAuth2Strategy = require('passport-oauth').Strategy;


module.exports = (req, res, passport) => {

  passport.use(new SlackStrategy({
		clientID: slackKeys.clientID,
		clientSecret: slackKeys.clientSecret,
		callbackURL: slackKeys.callbackURL,
		scope: 'incoming-webhook users:read',
    // extendedUserProfile: true
	}, (accessToken, refreshToken, profile, done)=>{
    User.findOrCreate({ SlackId: profile.id}, (err, user) => {

      return done(err, user);
    })
  }));
}
