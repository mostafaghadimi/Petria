var express = require('express');
var router = express.Router();

var io = require('socket.io')(8081);

var userModel = require('./../models/users');
var Chat = require('../models/chat');
var gamePassModel = require('../models/gamePasswords');

router.get('/', (req, res) => {
    console.log(req.session.userId);
    if (req.session && req.session.userId) {
        res.redirect('/user/scoreboard');
    } else {
        res.render(
            'main/index', {}
        );
    }
});

router.get('/profile', (req, res) => {
    if (req.session.userID) {

    } else {
        res.sendFile(path.join(__dirname, '../assets/index.html'))
    }
});

router.get('/chat', (req, res) => {
    if (req.session.userId) {
        teamName = req.session.teamName;
        faculty = req.session.faculty;
        console.log(teamName, faculty)
        io.on('connection', (socket) => {
            // Save new Messages to DB and show on the page
            socket.on('newMessage', message => {
                io.emit('newMessage', message)
                teamName = req.session.teamName;
                faculty = req.session.faculty;
                if (teamName && faculty) {
                    if (message != "") {
                        var newChatMessage = {
                            teamName: teamName,
                            faculty: faculty,
                            message: teamName + ": "+message
                        }
                        Chat.create(newChatMessage, (err, newChat) => {
                            if (err) {
                                console.log('[Chat Error]: ', err)
                            } else {
                                console.log(newChat)
                            }
                        })
                    }
                }
            })
        });
        // Get chats from mongoDB
        Chat.find({faculty: faculty}, (err, chatHistory) => {
            if (err) {
                console.log(err)
            }
            else {
                io.emit('messageHistory', chatHistory);
                console.log(chatHistory)
                res.render('main/chat', {
                    messages: chatHistory,
                    faculty: faculty,
                    teamName: teamName
                })
            }
        })
    }
    else {
        res.redirect('/')
    }


});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) console.log(err);
            else res.redirect('/')
        })
    }
    else {
        res.redirect('/');
    }
});

router.get('/gamePassword', (req, res) => {
    if (req.session.userId) {

        gamePassModel.find({faculty: req.session.faculty}, (err, gamePasses) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(gamePasses)
                res.render('main/gamePassword', {
                    gamePasses: gamePasses
                });

            }
        })
    }
    else {
        res.render('main/index')
    }
})


router.post('/vote/:gamePassword', (req, res) => {
    // TODO: prevent from multiple voting
    gamePassword = req.params.gamePassword;
    gamePassModel.findOne({password: gamePassword}, (err, result) => {
        if (err) console.log(err)
        else {
            result.votes += 1
            result.save((err) => {
                if (err) console.log(err)
            })
        }
    })
});

router.post('/gamePassword', (req, res) => {
    if (req.session.userId) {
        gamePassword = req.body.gamePassword;
        console.log(gamePassword)
        var newPassword = {
            password: gamePassword,
            teamName: req.session.teamName,
            faculty: req.session.faculty
        }

        gamePassModel.create(newPassword, (err, newPass) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(newPass);
                res.redirect('/user/scoreboard')
            }
        })

    }
})

router.post('/register', (req, res) => {
    var newUser = {
        teamName: req.body.teamName,
        faculty: req.body.faculty,
        email: req.body.email,
        password: req.body.password,
        isHashed: false
    }
    userModel.create(newUser, (err, user) => {
        if (err) {
            console.log('[Registration]: ' + err);
        } else {
            console.log('[Registration]: Done');
            req.session.userID = user._id;
            res.redirect('/user/scoreboard')
        }
    });
});

router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    userModel.authenticate(email, password, (err, user) => {
        if (err) {
            console.log('here')
            res.render('main/index', {
                err: "نام کاربری یا رمز عبور اشتباه است"
            })
        } else if (!user) {
            console.log('Wrong Password')
        } else {
            console.log(user);
            req.session.userId = user._id;
            req.session.faculty = user.faculty;
            req.session.teamName = user.teamName
            res.redirect('/user/scoreboard')
        }
    })
});

router.post('/priority', (req, res) => {
    console.log(req.body);
    userModel.find({_id: req.body.userId}, (err, user) => {
        if (err) console.log(err)
        else {
            user.teamName = req.body.teamName;
            user.teamNo = req.body.teamNo;
            user.taharoki1 = req.body.taharoki1;
            user.taharoki2 = req.body.taharoki2;
            user.fekri1 = req.body.fekri1;
            user.fekri2 = req.body.fekri2;
            user.sakhtani1 = req.body.sakhtani1;
            user.sakhtani2 = req.body.sakhtani2;
            user.etc1 = req.body.etc1;
            user.etc2 = req.body.etc2;
            user.save((err) => {
                if (err) console.log(err);
            });
        }
    });
    res.redirect('/user/scoreboard');
})

router.get('/scoreboard', async (req, res) => {
    console.log(req.session.userId)
    if (req.session.userId) {
        const teams = await userModel.find({}).sort('-score')
        const faculties = await userModel.aggregate([{
            "$group": {
                _id: "$faculty",
                average: {
                    $avg: "$score"
                }
            }
        }]).sort("-average")
        res.render('main/scoreboard', {
            teamInformation: teams,
            finalResult: faculties
        })
    } else {
        res.redirect('/')
    }


});

router.get('/priority', (req, res) => {
    if (req.session.userId) {
        res.render('main/priority', {
            userId: req.session.userId
        })
    }
    else {
        res.render('main/index')
    }
})
router.get('/map', (req, res) => {
    res.render('main/map')
})

module.exports = router;