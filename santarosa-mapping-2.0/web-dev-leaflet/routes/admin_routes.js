const express = require('express');
const router = express.Router();
const userModel = require('../UserModel.js');
const layerURLs = require('./layerURLs');
const layerPrefixes = require('./layerPrefixes');

/* POST pin search
 {
 AttributeToQuery: what type of attribute is being searched for (ex: person, name of location, address)
 StringToQuery: actual string that is being queried in the db
 }
 */

router.post('/pinSearch', function(req, res, next) {
    // Search for pins with the given field filter and text string
});

/* POST pin delete
 {
 featureID : Unique id of pin to delete from db. Supplied from the previous search.
 }
 */

router.post('/removePin', function(req, res, next) {
    /* How to delete pin from (both?!) DBs? */

});

/* POST admin user add/remove
 {
 username: submitted username
 password: submitted password
 }
 */

/* POST for removing users with admin accounts */
router.post('/removeUser', function(req, res, next) {
    userModel.find({
        username: req.body.username
    }).remove(function(err) {
        if (err) {
            alert("Admin User removal was not successful.");
        }
        else {
            alert("Admin User successfully removed from the DB.");
        }
    });
    res.send("Successful Removal!");
});

/* POST for adding new users with admin accounts */
router.post('/addUser', function (req, res, next) {
    var newUser = new userModel({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if(err) {
            alert("Adding Admin User was not successful.");
        }
        else {
            alert("New Admin User successfully added to the DB.");
        }
    });
    res.send("Successful Add!");
});

module.exports = router;