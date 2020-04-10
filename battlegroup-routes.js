const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./user');
const Battlegroup = require('./battlegroup');

let corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true
};

router.use((req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(401).send();
    }
});

router.options('/battlegroup', cors(corsOptions));
router.post('/battlegroup', cors(corsOptions), (req, res) => {
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
});

router.get('/battlegroup/:id?', cors(corsOptions), async (req, res) => {
    let params = {};
    if(req.params.id){
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            res.status(500).send();
            return;
        }
        Battlegroup.findOne({_id: new mongoose.Types.ObjectId(req.params.id)}, (err, battlegroup) => {
            if(err){
                res.status(500).send();
            } else {
                res.status(200).send(battlegroup);
            }
        });
    } else {
        let user = await User.findOne({id: req.user.id});
        let userId = new mongoose.Types.ObjectId(user._id);
        params.userId = req.query.sessionUser ? userId : { $ne: userId };
        Battlegroup.find(params, (err, battlegroups) => {
            if(err){
                res.status(500).send();
            } else {
                res.status(200).send(battlegroups);
            }
        });
    }
});

router.delete('/battlegroup/:id', cors(corsOptions), (req, res) => {
    Battlegroup.deleteOne({ _id: new mongoose.Types.ObjectId(req.params.id) }, (err) => {
        if(err){
            res.status(500).send();
        } else {
            res.status(200).send();
        }
    });
});

module.exports = router;


