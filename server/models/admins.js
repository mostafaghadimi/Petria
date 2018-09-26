var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var adminSchema = new Schema ({
    adminName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

adminSchema.pre('save', function (next) {
    var admin = this;
    console.log(admin)
    bcrypt.hash(admin.password, 10, (err, hash) => {
        if (err) return next(err);
        admin.password = hash;
        next();
    });
});

adminSchema.statics.authenticate = (email, password, callback) => {
    adminModel.findOne({email: email}, (err, admin) => {
        if (err) return callback(err);
        else if (!admin) {
            console.log('Admin not found');
        }
        else {
            bcrypt.compare(password, admin.password, (err, result) => {
                if (result){
                    callback(null, admin);
                }
                else {
                    return callback();
                }
            });
        }
    });
}

var adminModel = mongoose.model('Admin', adminSchema);
module.exports = adminModel;