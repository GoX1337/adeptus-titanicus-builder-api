const express = require('express');
const cors = require('cors');
const passport = require('./auth-fb');
const router = express.Router();
const User = require('./user');

router.get('/success', (req, res) => {
    if(!req.isAuthenticated()){
        console.log("/success: user not autenticated");
        res.redirect('/auth/facebook');
    } else {
        console.log('/success user:', req.user.id, req.isAuthenticated());
        res.redirect(process.env.FRONTEND_URL);
    }
});

let corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true
};

router.get('/profile', cors(corsOptions), (req, res) => {
    console.log("/profile cookies:", req.cookies);
    if(req.isAuthenticated()){
        User.findOne({id: req.user.id}, (err, user) => {
            console.log("/profile auth OK", user);
            res.status(200).send(user);
        }); 
    } else {
        res.status(401).send();
    }
});

router.get('/fail', (req, res) => {
    console.log('/fail');
    res.send("KO");
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: '/success', failureRedirect: '/fail' }));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;


