require('dotenv').config();
require('./db');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const app = express();
const passport = require('./auth-fb');
const authRoutes = require('./auth-routes');
const battlegroupRoutes = require('./battlegroup-routes');
const port = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'kek', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist'));
app.use(morgan('tiny'));

app.use("/", authRoutes);
app.use("/api", battlegroupRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
