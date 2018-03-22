const express = require('express');
const router = express.Router();
const catalogModel = require('../CatalogModel.js');
const layerURLs = require('./layerURLs');
const layerPrefixes = require('./layerPrefixes');


/* POST report
 {
 name: name of place
 place: what type of place it is
 type:
 importance: why is it important to you
 more: tell story here

 creationDate: todays date
 image: optional add image
 }
 */

router.post('/', function (req, res, next) {
    var catalog = new catalogModel({
        name: req.body.name
    });

    catalog.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("catalogItem added to DB successfully");
        }
    }).then(function (res) {
        catalogModel.find({
            name: req.body.name
        })
    });
});
module.exports = router;