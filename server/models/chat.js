var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var chatSchema = new Schema({
    teamName: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

var Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;