var express = require('express');
var app = express();

var session = require('express-session');
app.use(session({
  secret: "ILoveMostafa",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 43200000)
  }
}))

var path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Sarkade', {
  useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', () => {
  console.log('db not connected :(');
});
db.once('open', () => {
  console.log('[DataBase]: mongodb://localhost:27017/Sarkade')
});

// Logger - Useful for debugging
var morgan = require('morgan');
morgan.token('id', function getId(req) {
  return req.id
});
app.use(morgan(':id :method :url :response-time'));

// Nodejs Template Language
var ejs = require('ejs');
app.set('views', path.join(__dirname, '../assets/views'))
app.set('view engine', 'ejs');

app.use('/img/', express.static(path.join(__dirname, '../assets/img/')));
app.use('/css/', express.static(path.join(__dirname, '../assets/css/')));
app.use('/js/', express.static(path.join(__dirname, '../assets/js/')));
app.use('/font/', express.static(path.join(__dirname, '../assets/font/')));

// push notification
var webpush = require('web-push');
const vapidKeys = {
  publicKey: 'BFU4XoJ5zhPlM_T23Z3VKI74rsekQVc2GJjvCDXBp2waTyEC85b8w_ySVWpk5uyTx2O-xc55_myotALCSplmS6E',
  privateKey: 'SX8q5wYvtjyTCLzUeMyb4_h8dov0SzpIRJS6OkGuQEU'
}
webpush.setVapidDetails('mailto:mostafa.ghadimi@yahoo.com', vapidKeys.publicKey, vapidKeys.privateKey)

var user = require('./routes/user');
var admin = require('./routes/admin');
app.use('/', user);
app.use('/user', user);
app.use('/admin', admin);

app.listen(8080, () => {
  console.log('[port]: 8080')
})
