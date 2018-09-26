var express = require('express');
var router = express.Router();

var path = require('path')



router.post('/subscribe', (req, res) => {
    // get push subscription object
    const subscription = req.body;
    // send 201 - resource created
    res.status(201).json({})

    // create payload title of push notification
    var payload = JSON.stringify({
        title: 'Push test'
    })

    // pass object into sendNotification function
    webpush.sendNotification(subscription, payload).catch(err => console.err(err))

});

module.exports = router