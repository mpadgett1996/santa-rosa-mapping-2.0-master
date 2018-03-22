const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const spawn = require('child_process').spawn;
const videoPathsModel = require('../videoPathModel');

/*
Uploads the video to the server. When this function completes, the video is not yet associated with a featureId.
POST video
 {
    Attachment: file
 }
*/

router.post('/video', upload.single('Attachment'), function(req, res, next) {

    if (req.file.mimetype == 'video/mp4' || req.file.mimetype == 'video/avi') {
        var dir = "public/videos/";         //directory to store the videos into on the server
        var time = new Date().getTime(); 
        var path = dir + time;              //create the name of the video based on the time and the directory path
        fs.writeFile(path, req.file.buffer, function (err) {
            if (!err) {
                console.log("File written to", path);
                res.send(path);
                const videoPath = new videoPathsModel({
		            //add extensions to the video paths
                    mpegPath: path + ".mp4",
                    webmPath: path +".webm"
                });
                videoPath.save();
                //run the scripts to convert the videos to the correct formats 
                spawn('sh', ['convertMP4.sh', path, path + ".mp4"]);
                spawn('sh', ['convertWEBM.sh', path, path + ".webm"]);
            }
            else {
                console.log(err);
                res.send("Error");
            }
        });
    } else {
        console.log("Incorrect file type");
        res.send("Incorrect file type");
    }
});

/*
This route does two things, which are probably redundant:
1) It associates the video with a featureId using our database.
2) It sends the video to the ArcGIS attachment server.
**NOTE: Safari seems to have problems playing videos from the ArcGIS server, which is why we started using our own.**

POST sendVideo
{
 "Attachment": videoFile,
 "Path": videoPath,
 "url": url,
 "layer": layerName,
 "featureId": featureId);
 }
 */

router.post('/sendVideo', upload.single('Attachment'), function(req, res, next) {
    const originalRes = res;

    const formData = {
        f : "pjson",
        Attachment: fs.createReadStream(req.body.Path)
    };

    const conditions = {mpegPath: req.body.Path + ".mp4"};

    videoPathsModel.update(conditions, 
        { $set: { featureId: req.body.featureId, layer: req.body.layer} },
        function (err, res) {
            console.log(err);
            console.log(res);
    });

    request.post({
        url: req.body.url,
        formData: formData
    }, function(err, req, body) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Video file sent");
            originalRes.send(body);
        }
    });
});

module.exports = router;
