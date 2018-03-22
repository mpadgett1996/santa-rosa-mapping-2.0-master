const express = require('express');
const router = express.Router();
const request = require('request');
const layerURLs = require('./layerURLs');
const layerPrefixes = require('./layerPrefixes');

//var mobiledetect = require('mobile-detect'); // Used for phone detection

/* GET home page. */
router.get('/', function (req, res, next) {
    var MobileDetect = require('mobile-detect'),
        md = new MobileDetect(req.headers['user-agent']);
    console.log("~~~~~~~~~~~~~~~~~~~~~");
    console.log("We are currently looking at a phone: " + md.phone()!=null);
    console.log("REQUEST:" + express);
    console.log("The Width is: " + express.screenX);
    console.log("The Height is: " + express.screenY);
    console.log("Window width: " + req.screen);
    console.log("~~~~~~~~~~~~~~~~~~~~~");
    res.render('index');
});


/* GET map page. */
router.get('/map', function (req, res, next) {
    var MobileDetect = require('mobile-detect');
    md = new MobileDetect(req.headers['user-agent']);
    res.render('map.ejs', { mobile_detect: md});
});


/* GET report form page. */
router.get('/reportForm', function (req, res, next) {
    var originalRes = res;


    //console.log("LayerURLs: " + layerURLs[req.query.layer] + req.query.ID );

    //Get attributes for feature
    request.get({
        url: layerURLs[req.query.layer] + req.query.ID + "?f=pjson"
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        }

        var json = JSON.parse(body);
        var attributes = json.feature.attributes;
        var prefix = (layerPrefixes(req.query.layer)[req.query.ID]) ? layerPrefixes(req.query.layer)[req.query.ID] : "";
        attributes.prefix = prefix;
        originalRes.render('reportForm.ejs', attributes);
    })
});

/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

/* GET admin page */
router.get('/admin', function(req, res, next) {
    res.render('admin.ejs');
});

module.exports = router;