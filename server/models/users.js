var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema({
    teamName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    teamNo: {
        type: Number
    },
    faculty: {
        type: String,
        required: true
    },
    password: {
        required: true,
        type: String
    },
    score: {
        type: Number,
        default: 0
    },
    isHashed: {
        type: Boolean
    },
    fekri: {
        type: Number,
        default: 0
    },
    sakhtani: {
        type: Number,
        default: 0
    },
    taharoki: {
        type: Number,
        default: 0
    },
    etc: {
        type: Number,
        default: 0
    },
    fekri1: {
        type: String
    },
    fekri2: {
        type: String
    },
    sakhtani1: {
        type: String
    },
    sakhtani2: {
        type: String        
    },
    taharoki1: {
        type: String        
    },
    taharoki2: {
        type: String
    },
    etc1: {
        type: String
    },
    etc2: {
        type: String
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    console.log(user)
    if (!user.isHashed) {
        bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) return next(err)
            user.password = hash;
            user.isHashed = true;
            next();
        });
    }
});

userSchema.statics.authenticate = (email, password, callback) => {
    userModel.findOne({email: email}, (err, user) => {
        if (err) return callback(err);
        else if (!user) {
            console.log('User not found!')
        }
        else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    callback(null, user)
                }
                else {
                    return callback()
                }
            })
        }
    })
}

var userModel = mongoose.model('User', userSchema);
module.exports = userModel;
