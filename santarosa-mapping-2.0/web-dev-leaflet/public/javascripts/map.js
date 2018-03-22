//Santa Rosa Web Dev Team
var clickedCoords = [];
var videoPath;

var map = L.map('map',
    {
        //Restrict movement
        minZoom: 12,
        maxBounds: [
            [38.34, -122.88],
            [38.54, -122.54]
        ],
        doubleClickZoom: false

    }).setView([38.444660, -122.720306], 14);
L.DomUtil.TRANSITION = true;

//Create icons for the user points, pulled from leaflet awesome markers api
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
var icons = {
    Neighborhood: L.AwesomeMarkers.icon({
        icon: 'flag',
        markerColor: 'cadetblue'
    }),
    Park: L.AwesomeMarkers.icon({
        icon: 'bicycle',
        markerColor: 'green'
    }),
    House: L.AwesomeMarkers.icon({
        icon: 'home',
        markerColor: 'orange'
    }),
    School: L.AwesomeMarkers.icon({
        icon: 'graduation-cap',
        markerColor: 'blue'
    }),
    Business: L.AwesomeMarkers.icon({
        icon: 'building-o',
        markerColor: 'purple'
    }),
    Street: L.AwesomeMarkers.icon({
        icon: 'road',
        markerColor: 'red'
    }),
    Landmark: L.AwesomeMarkers.icon({
        icon: 'camera',
        markerColor: 'darkred'

    }),
    'Natural Place': L.AwesomeMarkers.icon({
        icon: 'tree',
        markerColor: 'darkgreen'
    }),
    'Community Center': L.AwesomeMarkers.icon({
        icon: 'users',
        markerColor: 'darkpurple'
    }),
    'Historical Place': L.AwesomeMarkers.icon({
        icon: 'bank',
        markerColor: 'orange'
    }),
    Other: L.AwesomeMarkers.icon({
        icon: 'question-circle',
        markerColor: 'black'
    })
}


L.control.locate({
    markerCLass: L.marker,
    follow: false,
    stopFollowingOnDrag: true,
    setView: true,
    maxZoom: 15

}).addTo(map);

var topo = L.esri.basemapLayer('Topographic').addTo(map);
var imagery = L.esri.basemapLayer('Imagery');

//Make sure to include the final slash
var layerURLs = {
    //urls for all the different layers we pull from arcgis.com
    "Neighborhood": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "Park": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "House": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "School": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "Business": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "Street": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "Natural Place": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Natural_Place_Layer/FeatureServer/0/',
    "Community Center": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/',
    "Other": 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/Santa_Rosa_Place_Layer/FeatureServer/0/'
}


//Add Feature Layers, each of these adds a layer to the map. The cluster feature layer is what allows the points to cluter
//when the user zooms out on the map
var userLayer = L.esri.Cluster.clusteredFeatureLayer({
    url: layerURLs["Neighborhood"],
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: icons[geojson.properties.type]
        })
    }
}).addTo(map);

var naturalLayer = L.esri.Cluster.clusteredFeatureLayer({
    url: layerURLs["Natural Place"],
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: icons['Natural Place']
        })
    }
}).addTo(map);

var publicSchools = L.esri.Cluster.clusteredFeatureLayer({
    url: 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/SantaRosaBasemap/FeatureServer/1',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: icons['School']
        })
    }
});

var parks = L.esri.Cluster.clusteredFeatureLayer({
    url: 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/SantaRosaBasemap/FeatureServer/3',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: icons['Park']
        })
    }
});

var HistoricalBuilding = L.esri.Cluster.clusteredFeatureLayer({
    url: 'http://services1.arcgis.com/tIgNEsvmQ5Qg6njs/arcgis/rest/services/SantaRosaNRHP/FeatureServer/0',
    pointToLayer: function (geojson, latlng) {
        return L.marker(latlng, {
            icon: icons['Historical Place']
        })
    }
});

var layer = {
    "User Layer": userLayer,
    "Natural Place": naturalLayer,
    "Public Schools": publicSchools,
    "Parks": parks,
    "Historical Buildings": HistoricalBuilding,
    "Imagery": imagery
};

var layerDictionary = {
        "Neighborhood": userLayer,
        "Park": userLayer,
        "House": userLayer,
        "School": userLayer,
        "Business": userLayer,
        "Street": userLayer,
        "Natural Place": naturalLayer,
        "Community Center": userLayer,
        "Other": userLayer
}

//Create toggle menu
L.control.layers(null, layer).addTo(map);

//Create search bar
L.esri.Geocoding.geosearch({
    providers: [L.esri.Geocoding.arcgisOnlineProvider()],
    searchBounds: [
        [38.34, -122.88],
        [38.54, -122.54]
    ]
}).addTo(map);

//Use this service to lookup addresses from coords
var addressFinder = L.esri.Geocoding.reverseGeocode();

//Hide file upload if browser does not support it
var checkFormData = function () {
    if (!!window.formData) {
        $("#file-upload").html("<span>Unfortunately, your browser does not support uploads to our servers. Try a newer one!</span>");
        return false;
    }
    return true;
}();

//Handle icon clicks
function bindCustomLayers() {
    $.post('/prefixes', function (res) {
        userLayer.bindPopup(function (evt) {
            //Set the prefix to null if the server values are undefined
            var userPrefix = (res.userLayer[evt.properties.OBJECTID]) ? res.userLayer[evt.properties.OBJECTID] : "";
            return L.Util.template(
                userPrefix +
                //Handle events with the button's class, and use the id to pass the feature id to the handler
                '<div class="pull-right"><button type="button" class="btn btn-warning btn-xs report {type}" id="{OBJECTID}" href="/reportForm?ID={OBJECTID}">Report</button></div>' +
                '<p><b>Place:</b> {place}<br /><b>Person:</b> {name} <br />' +
                '<b>Type:</b> {type}<br /><b>Importance:</b> {importance}</br />{more}</p>', evt.properties);
        });
        naturalLayer.bindPopup(function (evt) {
            //Set the prefix to null if the server values are undefined
            var naturalPrefix = (res.naturalLayer[evt.properties.OBJECTID]) ? res.naturalLayer[evt.properties.OBJECTID] : "";
            return L.Util.template(
                naturalPrefix +
                //Handle events with the button's class, and use the id to pass the feature id to the handler
                '<div class="pull-right"><button type="button" class="btn btn-warning btn-xs report {type}" id="{OBJECTID}" href="/reportForm?ID={OBJECTID}">Report</button></div>' +
                '<p><b>Place:</b> {place}<br /><b>Person:</b> {name} <br />' +
                '<b>Type:</b> {type}<br /><b>Importance:</b> {importance}</br />{more}</p>', evt.properties);
        });
    });
}
bindCustomLayers();

// The ArcGIS call returns an html table with abbreviated columns
// and some redundant data. This extracts and returns the Street Address only.
function replaceTable( html ) {
    var originHTML = html.split('\n'); // split items into a list

    originHTML.splice(0,23); // Delete redundant items

    var res = originHTML[0]; // Grab Street Address
    res = res.substring(4, res.length - 5) + '.' ; // remove <td> tags

    return res;
}

publicSchools.bindPopup(function (evt) {
    //grab the information for the public schools from the public schools arcgis layer and add it to our points
    //on the webpage
    evt.properties.PopupInfo = replaceTable(evt.properties.PopupInfo);

    return L.Util.template(                                       // evt.properties -> {PopupInfo} needs to be modified
        '<p><b>Public School:</b> {Name}</p><p><b>Street Address:</b> {PopupInfo}</p>', evt.properties);
});

parks.bindPopup(function (evt) {
    return L.Util.template(
        '<p><b>Park:</b>{Name}</p>', evt.properties);
});

HistoricalBuilding.bindPopup(function (evt) {
    return L.Util.template(
        '<p><b>Building:</b>{RESNAME}<br /><b>Source:</b>{SOURCE}</p>', evt.properties);

});

//Handle map clicks (for adding events)
function openSideBar(evt) {
    clickedCoords = evt.latlng;

    //Search for address, show it in form if we find it
    addressFinder
        .latlng(clickedCoords)
        .run(function (err, result, response) {

            if (err) {
                $("#address-form-group").hide();
            }
            else {
                $("#address-form-group").show();
                $("#address").val(result.address.Address);
            }
        });
    //$("#wrapper").addClass("toggled");
    w3_open();
}

//open the side bar to enter a point on double click
map.on("dblclick", function (evt) {;
    openSideBar(evt);
    //if (!$("#wrapper").hasClass("toggled")) {
    //    openSideBar(evt);
    //}
    //else {
    //    $("#wrapper").removeClass("toggled");
    //}
});

function w3_open() {
    document.getElementsByClassName("w3-sidenav")[0].style.display = "block";
    document.getElementsByClassName("w3-sidenav")[0].style.visibility = "visible";
    document.getElementsByClassName("w3-sidenav")[0].style.opacity = "1";
    document.getElementsByClassName("w3-sidenav")[0].style.zIndex = "1500";
    document.getElementsByClassName("w3-overlay")[0].style.display = "block";
    document.getElementsByClassName("map")[0].style.opacity = ".5";
    document.getElementsByClassName("map")[0].style.position = "fixed";
}
function w3_close() {
    document.getElementsByClassName("map")[0].style.opacity = "1";
    document.getElementsByClassName("w3-sidenav")[0].style.display = "none";
    document.getElementsByClassName("w3-overlay")[0].style.display = "none";
    document.getElementsByClassName("map")[0].style.position = "";
}

/* Open Overlay*/
function openNav() {
    document.getElementById("instructions").style.height = "100%";
}

/* Close Overlay*/
function closeNav() {
    document.getElementById("instructions").style.height = "0%";
}
//Right click or longtap on mobile
map.on("contextmenu", function (evt) {
    openSideBar(evt);
});

//closes sidebar when scrolling
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        //hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        w3_close();
    } else {
        // Scroll Up
       w3_close();
    }

    lastScrollTop = st;
}

//closes side bar on escape
window.addEventListener("keyup", keyboardEvent, false);
function keyboardEvent(evt) {
    if (evt.keyCode === 27) {
        w3_close();
    }
}

//Handle swipes
//$("#sidebar-wrapper").swipe({
//    swipeRight: function (evt, direction, distance, duration, fingerCount) {
//        $("#wrapper").removeClass("toggled");
//        console.log("swipedRight", distance, "pixels");
//    }
//});

//called when the user uploads a video file, see the routes/upload_video.js file for how this is done on the server
//videos are stored in the public/videos folder
function uploadVideo(layerName, featureInfo, videoFile) {

    if (videoFile !== undefined && videoFile.type.startsWith("video")) {

        var url = layerURLs[layerName] + featureInfo.objectId + '/addAttachment'
        var data = new FormData();
        data.append("Attachment", videoFile);
        data.append("Path", videoPath);
        data.append("url", url);
        data.append("layer", layerName);
        data.append("featureId", featureInfo.objectId);

	//call the upload/sendVideo post request which convert the video to different formats for multiple web browsers
	//code for how this is done is found in the routes/upload_video.js file
        $.ajax({
                type: "POST",
                url: '/upload/sendVideo',
                contentType: false,
                processData: false,
                data: data,
                success: function (res) {
                    resJson = JSON.parse(res);
                    $.post('/prefixes/update', {
                        url: layerURLs[layerName] + featureInfo.objectId + '/attachments/' + resJson.addAttachmentResult.objectId,
                        type: videoFile.type,
                        layer: layerName,
                        objectId: featureInfo.objectId,
                    }, function (res) {
                        bindCustomLayers()
                    });
                }
            }
        )
    }
}

//called when the user uploads an image file, stores the image on arcgis, not on our server
function uploadImage(layerName, featureInfo, imageFile) {

    if (imageFile !== undefined && imageFile.type.startsWith("image")) {

        var url = layerURLs[layerName] + featureInfo.objectId + '/addAttachment';
        var data = new FormData();
        data.append("Attachment", imageFile);
        data.append("f", "pjson");

        $.ajax({
                type: "POST",
                url: url,
                contentType: false,
                processData: false,
                data: data,
                success: function (res) {
                    resJson = JSON.parse(res);
                    $.post('/prefixes/update', {
                        url: layerURLs[layerName] + featureInfo.objectId + '/attachments/' + resJson.addAttachmentResult.objectId,
                        type: imageFile.type,
                        layer: layerName,
                        objectId: featureInfo.objectId
                    }, function (res) {
                        bindCustomLayers();
                    });
                }
            }
        )
    }

}

//Hide sidebar and clear fields
var resetFields = function () {
    //$("#wrapper").toggleClass("toggled");
    w3_close();
    $("#place").val('');
    $("#name").val('');
    $("#type").selectpicker('val', '');
    $("#importance").selectpicker('val', '');
    $("#file-select").val('');
    $("#more").val('');
};

// Filters passed string, replacing characters with asterisks
function filter(string) {
    string = string || '';

    var dictionary = bannedWords();
    var regexp = new RegExp(dictionary.join('|'), 'gi');

    var name = $("#name").val();
    var place = $("#place").val();

    return string.replace(regexp, function(s) {
        var i = 0;
        var asterisks = '';

        while (i < s.length) {
            asterisks += '*';
            i++;
        }

        return asterisks;
    });
}

// Checks passed string, prints appropriate error message
function checkForInput(string, inputNum) {
    if(string == '') {
        switch(inputNum) {
            case 1:
                alert("Please enter a name for your location.");
                break;
            case 2:
                alert("Please enter your name.");
                break;
            case 3:
                alert("Please enter a description for your location.");
                break;
        }
        return false;
    }
    switch(inputNum) {
        case 1:
            if(string.length > 60) {
                alert("Please shorten your location name.");
                return false;
            }
            break;
        case 2:
            if(string.length > 40) {
                alert("Please shorten your entered name.");
                return false;
            }
            break;
        case 3:
            if(string.length > 256) {
                alert("Please shorten your description.");
                return false;
            }
            break;
    }
    return true;
}

//Submit new points
$('#submit-add').click(function () {
    var filteredPlace = filter($("#place").val());
    var filteredName = filter($("#name").val());
    var filteredMore = filter($("#more").val());
    var type = $("#type").val();
    var importance = $("#importance").val();


    if(checkForInput(filteredPlace, 1) == false || checkForInput(filteredName, 2) == false || checkForInput(filteredMore, 3) == false) {
        return false;
    }

    //Create GeoJSON; See: http://geojson.org/geojson-spec.html
    var newGEOJSON = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [clickedCoords.lng, clickedCoords.lat]
        },
        "properties": {

            "Creator": "Santa Rosa Place", //This should maybe be something else
            "CreationDate": new Date(),
            "place": filteredPlace,
            "name": filteredName,
            "type": type,
            "importance": $("#importance").val(),
            "more": filteredMore
        }
    };

    layerDictionary[type].addFeature(newGEOJSON, function (err, info) {
        var file = document.getElementById('file-select').files[0];
        uploadImage(type, info, file);
        uploadVideo(type, info, file); //Running both of these is kinda silly
        resetFields();
    });

    /* catalog = collection */
    var Catalog = mongoose.model('catalogs', CatalogSchema);
    var newCatalogItem = new Catalog();
    newCatalogItem.name = 'Michelle';
    Catalog.insertOne(newCatalogItem);

    newCatalogItem.save(function (err, newCatalogItem) {

        if (err) return console.error(err);
    });

});

//Report features. Must add event handler to document because button is generated dynamically
$(document).on('click', 'button.btn.btn-warning.btn-xs.report', function (evt) {
    window.location.href = "/reportForm?layer=" + evt.target.classList[4] + "&ID=" + evt.target.id;
});

//Returns resolved promise if the file header matches mp4 or avi formats
//See: http://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
function isReallyVideo(file) {
    var deferred = $.Deferred();

    var fileReader = new FileReader();
    fileReader.onloadend = function (e) {
        var arr = (new Uint8Array(e.target.result)).subarray(0, 16);
        var firstFourBytes = "";
        var lastEightBytes = "";
        var middleEightBytes = "";
        for (var i in arr) {
            if (i < 4) {
                firstFourBytes += arr[i].toString(16);
            }
            else if (i < 8) {
                middleEightBytes += arr[i].toString(16);
            }
            else if (i < 12) {
                middleEightBytes += arr[i].toString(16);
                lastEightBytes += arr[i].toString(16);
            }
            else {
                lastEightBytes += arr[i].toString(16);
            }
        }

        if (firstFourBytes == "52494646" && lastEightBytes == "415649204c495354") {
            //AVI files
            deferred.resolve();
        }

        switch (middleEightBytes) {
            case "6674797033677035": //MP4	 	MPEG-4 video files
            case "667479704d534e56": //MP4	 	MPEG-4 video file
            case "6674797069736f6d": //MP4	 	ISO Base Media file (MPEG-4) v1
                deferred.resolve();
                break;
            default:
                deferred.reject();
        }
    }
    fileReader.readAsArrayBuffer(file);
    return deferred.promise();
}

$("#file-select").on("change", function () {
    //console.log(document.getElementById('file-select').files[0]);
    var file = document.getElementById('file-select').files[0];

    if (file.type.startsWith("video")) {

        isReallyVideo(file).done(function () {

            $("#submit-add").prop("disabled", true);
            $("#upload-message").show();

            var data = new FormData();
            data.append("Attachment", file);

            $.ajax({
                type: "POST",
                url: '/upload/video',
                contentType: false,
                processData: false,
                data: data,
                success: function (res) {
                    console.log(res);
                    videoPath = res;
                    $("#upload-message").hide();
                    $("#submit-add").prop("disabled", false);
                }
            });
        });
    }
});

function bannedWords() {
    return dictionary = ["fuck","4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
}