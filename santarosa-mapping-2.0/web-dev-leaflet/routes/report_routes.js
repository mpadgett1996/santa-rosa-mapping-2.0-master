const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const reportsModel = require('../ReportModel.js');
const layerURLs = require('./layerURLs');
const layerPrefixes = require('./layerPrefixes');

/* POST report
 {
 layer: layer name
 ID: featureId
 field: field reported
 why: explanation of why
 email: email address
 }
 */
router.post('/', function (req, res, next) {
    var transporter = nodemailer.createTransport('smtps://santarosamapping%40gmail.com:sr-mapping1@smtp.gmail.com');
    var layerName = req.query.layer;

    var report = new reportsModel({
        layer: req.body.layer,
        featureId: req.body.ID,
        field: req.body.field,
        why: req.body.why,
        email: req.body.email,
        reportType: req.body.reportType
    });
    console.log("Layer URL = " + req.body.layer);
    report.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("report added to DB successfully");
        }
    }).then(function(res) {

        reportsModel.find({
            layer: req.body.layer,
            featureId: req.body.ID
        }, function(err, res) {
            var total, inacc_count, inapp_count,adSpam_count;

            inacc_count = inapp_count = adSpam_count = 0;
            total = res.length;

            console.log("ReportType = " + res[0].reportType);
            for (var i = 0; i < total; i++){
                if (res[i].reportType === "Inacc"){
                    inacc_count += 1
                }else if (res[i].reportType === "Inapp"){
                    inapp_count += 1
                }else{
                    adSpam_count += 1
                }
            }
            if( total % 3 == 0){
            /*if (inacc_count % 20 === 0) {
                var mailOptions = {
                    from: 'Dev <santarosamapping@gmail.com>',
                    to: 'santarosamapping@gmail.com',
                    subject: 'New report!',
                    html: "<p>The following feature has been reported three (more?) times:</p>" +
                    "<p>" + layerURLs[layerName] + req.body.ID + "</p><br />" +
                    "<table style='border-spacing: 15px'>" + "<tr>" + "<th>Email</th><th>Date</th><th>Field</th><th>Explanation</th>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-1].email + "</td><td>" + res[count-1].date.toString().slice(0, 15) + "</td><td>" + res[count-1].field + "</td><td>" + res[count-1].why + "</td>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-2].email + "</td><td>" + res[count-2].date.toString().slice(0, 15) + "</td><td>" + res[count-2].field + "</td><td>" + res[count-2].why + "</td>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-3].email + "</td><td>" + res[count-3].date.toString().slice(0, 15) + "</td><td>" + res[count-3].field + "</td><td>" + res[count-3].why + "</td>" + "</tr>" +
                    "</table> </div>"
                };

                //Redo the same query and remove results
                reportsModel.find({
                    layer: req.body.layer,
                    featureId: req.body.ID
                }).remove(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("reports successfully deleted from DB");
                    }
                });

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Message sent: ' + info.response);
                })
            }else if( inapp_count % 5 === 0 || adSpam_count % 5 === 0){*/
                var mailOptions = {
                    from: 'Dev <santarosamapping@gmail.com>',
                    to: 'santarosamapping@gmail.com',
                    subject: 'New report!',
                    html: "<p>The following feature has been reported three (more?) times:</p>" +
                    "<p>" + layerURLs[layerName] + req.body.ID + "</p><br />" +
                    "<table style='border-spacing: 15px'>" + "<tr>" + "<th>Email</th><th>Date</th><th>Field</th><th>Explanation</th>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-1].email + "</td><td>" + res[count-1].date.toString().slice(0, 15) + "</td><td>" + res[count-1].field + "</td><td>" + res[count-1].why + "</td>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-2].email + "</td><td>" + res[count-2].date.toString().slice(0, 15) + "</td><td>" + res[count-2].field + "</td><td>" + res[count-2].why + "</td>" + "</tr>" +
                    "<tr>" + "<td>" + res[count-3].email + "</td><td>" + res[count-3].date.toString().slice(0, 15) + "</td><td>" + res[count-3].field + "</td><td>" + res[count-3].why + "</td>" + "</tr>" +
                    "</table> </div>"
                };
                //Redo the same query and remove results
                reportsModel.find({
                    layer: req.body.layer,
                    featureId: req.body.ID
                }).remove(function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("reports successfully deleted from DB");
                    }
                });

                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Message sent: ' + info.response);
                })
            }else
                console.log("Still need to log", 3 - (total % 3), "reports before an email is sent");
        })
    });

    res.send("success?");

});

module.exports = router;