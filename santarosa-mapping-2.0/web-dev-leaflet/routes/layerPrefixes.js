/*
"Prefixes" are appended to the beginning of the HTML used to display popups.
We use them to display pictures and videos.
They require database accesses and/or requests to the ArcGIS server, so we store them on the server.
The browser can request them using Ajax (see: prefixes_routes.js).
 */

const startTime = new Date().getTime();
const request = require('request');
const layerURLs = require('./layerURLs');
const videoPathsModel = require('../videoPathModel');

var userPrefixArray = [];
var naturalPrefixArray = [];

/*
This has to be a function, since apparently making an object copies the (currently empty) arrays.
It is used to translate layer names to prefix arrays.
 */
const layerPrefixes = function (name) {

    var arrays = {

        "userLayer": userPrefixArray,
        "Neighborhood": userPrefixArray,
        "Park": userPrefixArray,
        "House": userPrefixArray,
        "School": userPrefixArray,
        "Business": userPrefixArray,
        "Street": userPrefixArray,
        "Natural": naturalPrefixArray,
        "Natural Place": naturalPrefixArray,
        "Community": userPrefixArray,
        "Community Center": userPrefixArray,
        "Other": userPrefixArray
    };

    return arrays[name];
};

/*
Check the ArcGIS server for attachments to the given featureId.
If an attachment is found, determine if it's an image of a video and add the appropriate prefix to the array
 */
function getPrefix(layer, layerURL, featureId, numIds, prefixArray, resolve) {
    request.get({
            url: layerURL + featureId + "/attachments/?f=pjson&token="
        },
        function (err, req, body) {
            //TODO: Handle error here
            if (err) {
                // Timeouts from the ArcGIS server are common, which means some prefixes are not retrieved correctly.
                console.log(err);
            }
            else {
                var url = layerURL + featureId + "/attachments";
                var prefix = "";
                resJson = JSON.parse(body);
                attachment = resJson.attachmentInfos[0];
                if (attachment) {
                    attachmentURL = url + "/" + attachment.id;
                    //TODO: Fix portrait pictures turn on their side
                    if (attachment.contentType === ("image/jpeg")) {
                        prefix = "<a href='" + attachmentURL + "' target='_blank'><img src='" + attachmentURL + "' width=100% height=100% style='padding:10px;'></a>";
                    }
                    else if (attachment.contentType === "video/mp4") {
                        prefix = "<video width=100% height=100%' controls>" +
                            "<source src='" + attachmentURL + "' type='video/mp4'>" +
                            "Your browser does not support the video tag." +
                            "</video>"

                    }
                }

                prefixArray[featureId] = prefix;
            }
            resolve({
                layer: layer, //Not currently using layer, but we probably will when we have a layer for each type
                featureId: featureId
            });
        }
    )
}

/*
Promise for getting active feature Ids of a given layer.
Eg 1, 2, 4, 5 (featureId 3 must have been deleted)
 */
function populateIdArray(layerURL) {
    return new Promise(function (resolve, reject) {
        request.post({
            url: layerURL + 'query',
            form: {
                f: 'json',
                returnIdsOnly: true,
                //TODO: Is there a better way to get all features?
                where: "OBJECTID > 0"
            }
        }, function (err, req, body) {
            if (err) {
                reject(err)
            }
            else {
                var resJson = JSON.parse(body);
                resJson.url = layerURL;
                resolve(resJson);
            }
        })
    });
}


/*
Get array of feature Ids for layer, then get prefixes based on ArcGIS request
After that is done, check our database for videos. If we find any, make the prefix and add it to the array.
 */
populateIdArray(layerURLs["Neighborhood"]).then(function (res) {
    var prefixes = [];
    var promises = [];
    for (x in res.objectIds) {
        promises[x] = new Promise(function (resolve) {
            getPrefix("userLayer", res.url, res.objectIds[x], res.objectIds.length, prefixes, resolve);
        });
    }
    
    //Now add the videos stored on our server and finalize
    Promise.all(promises).then(function (res) {

        videoPathsModel.find({layer: {$ne: "Natural Place"}}, function(err, res) {
            for (x in res) {
                var prefix = "<video width=100% height=100%' controls>" +
                    "<source src='" + res[x].mpegPath.slice(6) + "' type='video/mp4'>" +
                    "<source src='" + res[x].webmPath.slice(6) + "' type='video/webm'>" +
                    "Your browser does not support the video tag." +
                    "</video>"

                prefixes[res[x].featureId] = prefix;
            }
            userPrefixArray = prefixes;
            var end = new Date().getTime();
            console.log("userPrefixArray took this many seconds: ", (end - startTime) / 1000);
        });
    })
});


/*
 Get array of feature Ids for layer, then get prefixes based on ArcGIS request
 After that is done, check our database for videos. If we find any, make the prefix and add it to the array.
 */
populateIdArray(layerURLs["Natural Place"]).then(function (res) {
    var prefixes = [];
    var promises = [];
    for (x in res.objectIds) {
        promises[x] = new Promise(function (resolve) {
            getPrefix("naturalLayer", res.url, res.objectIds[x], res.objectIds.length, prefixes, resolve);
        });
    }
    //Now add the videos stored on our server
    Promise.all(promises).then(function (res) {

        videoPathsModel.find({layer: "Natural Place"}, function(err, res) {
            for (x in res) {
                var prefix = "<video width=100% height=100%' controls>" +
                    "<source src='" + res[x].mpegPath.slice(6) + "' type='video/mp4'>" +
                    "<source src='" + res[x].webmPath.slice(6) + "' type='video/webm'>" +
                    "Your browser does not support the video tag." +
                    "</video>"

                prefixes[res.featureId] = prefix;
            }
            naturalPrefixArray = prefixes;
            var end = new Date().getTime();
            console.log("naturalPrefixArray took this many seconds: ", (end - startTime) / 1000);
        });
    })
 });

module.exports = layerPrefixes;