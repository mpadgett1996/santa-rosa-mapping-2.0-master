/**
 * Created by michellepadgett on 4/24/17.
 */


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const catalogModel = require('../CatalogModel.js');
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

    var catalog = new catalogModel({
        place: req.body.place,
        name: req.body.name,
        address: req.body.address,
        type_of_place: req.body.type_of_place,
        why: req.body.why,
        image: req.body.image,
        date: req.body.date
    });

    catalog.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("report added to DB successfully");
        }
    }).then(function(res) {
        catalogModel.find({
            place: req.body.place,
            name: req.body.name
        }, function(err, res) {
            count = res.length;
            if (count % 3 == 0) {
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
                }

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
            }
            else {
                console.log("Still need to log", 3 - (count % 3), "reports before an email is sent");
            }
        })
    });

    res.send("success?");

});

module.exports = router;