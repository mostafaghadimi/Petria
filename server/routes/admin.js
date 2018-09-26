var express = require('express');
var router = express.Router();
var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var adminModel = require('./../models/admins');
var Users = require('../models/users');

router.get('/', (req, res) => {
    res.render('main/admin')
});

router.get('/submitScore', (req, res) => {
    // TODO: check the whether the logged user is admin or not
    if (req.session.adminId) {
        Users.find({}, (err, teams) => {
            console.log(teams);
            res.render('main/submitScore', {
                teams: teams
            });
        })
    }
    else {
        res.redirect('/admin/')
    }
});

router.post('/submitScore', (req, res) => {
    if (req.session.adminId) {
        totalScore = req.body.winnerScore + req.body.loserScore;
        gameName = req.body.gameName;
        Users.findOne({teamName: req.body.winnerName}, (err, winner) => {
            // TODO: add special bonus for winner!
            if (gameName == "بازی فکری") {
                winner.fekri = winner.fekri + (req.body.winnerScore) * 80 + 20
            }
            else if (gameName == "بازی ساختنی") {
                winner.sakhtani = winner.sakhtani + (req.body.winnerScore) * 80 + 20
            }
            else if (gameName == "بازی تحرکی"){
                winner.taharoki = winner.taharoki + (req.body.winnerScore) * 80 + 20
            }
            else if (gameName == "بازی دیگر"){
                winner.etc = winner.etc + (req.body.winnerScore) * 80;
            }
            console.log(winner)
            winner.score = winner.score + (req.body.winnerScore / totalScore) * 80 + 20;
            winner.save((err) => {
                if (err) {
                    console.log(err)
                }
            });
        });
    
        Users.findOne({teamName: req.body.loserName}, (err, loser) => {
            console.log(loser)
            if (gameName == "بازی فکری") {
                loser.fekri = loser.fekri + (req.body.loserScore) * 80 + 20
            }
            else if (gameName == "بازی ساختنی") {
                loser.sakhtani = loser.sakhtani + (req.body.loserScore) * 80 + 20
            }
            else if (gameName == "بازی تحرکی"){
                loser.taharoki = loser.taharoki + (req.body.loserScore) * 80 + 20
            }
            else if (gameName == "بازی دیگر"){
                loser.etc = loser.etc + (req.body.loserScore) * 80;
            }
            loser.score += (req.body.loserScore / totalScore) * 80;
            loser.save((err) => {
                if (err) {
                    console.log(err)
                }
            }) 
            // TODO: Redirect to admins main page
        })
    }
    else {
        res.redirect('/admin')
    }
    
    // res.redirect('/');
});

router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    adminModel.authenticate(email, password, (err, admin) => {
        if (err) {
            res.render('main/admin')
        }
        else if (!admin) {
            console.log('Wrong Password');
        }
        else {
            req.session.adminId = admin._id;
            req.session.faculty = admin.faculty;
            req.session.username = admin.username;
            res.redirect('/admin/submitScore');
        }
    })
});

router.post('/register', (req, res) => {
    var newAdmin = {
        adminName: req.body.adminName,
        faculty: req.body.faculty,
        email: req.body.email,
        password: req.body.password
    }

    adminModel.create(newAdmin, (err, admin) => {
        if (err) {
            console.log('[Admin Registration]: ' + err);
        }
        else {
            console.log('[Admin Registration]: Done');
            req.session.adminId = admin._id;
            res.redirect('/admin/submitScore')
        }
    })
});


module.exports = router;