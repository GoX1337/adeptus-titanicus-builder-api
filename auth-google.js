const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
const User = require('./user');

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    (accessToken, refreshToken, profile, cb) => {
        let user = {
            id: profile.id,
            displayName: profile.displayName,
            accessToken: accessToken
        };
        User.findOneAndUpdate({ id: profile.id }, user, { upsert: true, useFindAndModify: false, new: true }, (err, user) => {
            console.log("user:", user.id, user.displayName);
            return cb(null, user);
        });
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    User.findOne({id: id}, (err, user) => {
        cb(null, user);
    });
});

module.exports = passport;