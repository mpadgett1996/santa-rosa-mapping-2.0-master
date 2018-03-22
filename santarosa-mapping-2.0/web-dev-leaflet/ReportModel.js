/*Defines schema for saving report information*/

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    layer: { type: String},
    featureId: {type: Number},
    email: { type: String},
    field: { type: String},
    why: { type: String},
    date: { type: Date, default: Date.now },
    reportType: { type: String }
});

module.exports = mongoose.model('Reports', ReportSchema);
