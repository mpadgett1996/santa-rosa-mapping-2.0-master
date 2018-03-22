/*Defines schema for saving paths to videos stored on server*/

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VideoPathSchema = new Schema({
    layer: {type: String},
    featureId: {type: String},
    mpegPath: {type: String},
    webmPath: {type: String}
});

module.exports = mongoose.model('VideoPaths', VideoPathSchema);