require('dotenv').config();
require('./db');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const passport = require('./auth-fb');
const User = require('./user');
const Battlegroup = require('./battlegroup');
let port = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'kek', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    console.log('Home', req.session.id);
    res.send("Home");
});

app.get('/success', (req, res) => {
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

app.get('/profile', cors(corsOptions), (req, res) => {
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

app.options('/battlegroup', cors(corsOptions));
app.post('/battlegroup', cors(corsOptions), (req, res) => {
    console.log("/battlegroup", req.cookies);
    if(req.isAuthenticated()){
        console.log("/battlegroup", req.body);

        User.findOne({id: req.user.id}, (err, user) => {

            var battlegroup = new Battlegroup({ 
                name: req.body.name,
                total: req.body.total,
                userId: user._id,
                list: req.body.list
            });

            battlegroup.save(function (err, battlegroup) {
                if(err){
                    res.status(500).send();
                } else {
                    res.status(200).send(battlegroup);
                }
            });
        });

    } else {
        res.status(401).send();
    }
});

app.get('/battlegroup', cors(corsOptions), (req, res) => {
    Battlegroup.find((err, battlegroups) => {
        if(err){
            res.status(500).send();
        } else {
            res.status(200).send(battlegroups);
        }
    });
});

app.get('/fail', (req, res) => {
    console.log('/fail');
    res.send("KO");
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect: '/success', failureRedirect: '/fail' }));

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.FRONTEND_URL);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
