var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gamePassSchema = new Schema({
    password: {
        type: String,
        required: true,
        trim: true
    },
    teamName: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    faculty: {
        type: String,
        required: true
    }
})


var gamePassModel = mongoose.model('gamePasswords', gamePassSchema)
module.exports = gamePassModel;