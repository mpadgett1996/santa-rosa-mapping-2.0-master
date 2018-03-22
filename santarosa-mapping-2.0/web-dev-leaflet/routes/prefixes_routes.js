const express = require('express');
const router = express.Router();
const layerPrefixes = require('./layerPrefixes');
const videoPathsModel = require('../videoPathModel');

/* Send prefixes */
router.post('/', function (req, res, next) {
    res.send({
        userLayer: layerPrefixes("Neighborhood"),
        naturalLayer: layerPrefixes("Natural Place")
    });
});


/* Update prefixes when a new attachment is submitted
 {
 url:
 type: ,
 layer: ,
 objectId:
 }
*/
router.post('/update', function (req, res, next) {
    var originalRes = res;
    var layerName = req.body.layer;
    var attachmentURL = req.body.url;
    var contentType = req.body.type;
    var prefix = "";
    if (contentType.startsWith("image")) {
        console.log("image detected");
        prefix = "<a href='" + attachmentURL + "' target='_blank'><img src='" + attachmentURL + "' width='100%' height='100%'></a>";
        res.send("Image prefix added");
    }
    else if (contentType.startsWith("video")) {
        console.log("video detected");
        videoPathsModel.findOne({
            layer: layerName,
            featureId: req.body.objectId
        }, function(err, res) {
            console.log(res);
            //TODO: Does this video player work well enough?
            prefix = "<video width=100% height=100%' controls>" +
                "<source src='" + res.mpegPath.slice(6) + "' type='video/mp4'>" +
                "<source src='" + res.webmPath.slice(6) + "' type='video/webm'>" +
                "Your browser does not support the video tag." +
                "</video>"
            console.log("Adding newly submitted prefix ", prefix, "for featureId ", req.body.objectId);
            layerPrefixes(layerName)[req.body.objectId] = prefix;
            originalRes.send("Video Prefix Added");
        });
    }
    

});

module.exports = router;
