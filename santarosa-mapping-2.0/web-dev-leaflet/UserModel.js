/* Defines schema for saving user information */

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String},
    password: {type: String},
    id: {type: Number},
    date: {type: Date, default: Date.now}
    }, {
        collection: 'Users'
});

module.exports = mongoose.model('Users', UserSchema);