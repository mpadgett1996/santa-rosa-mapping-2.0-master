# Setup

1. Clone the repository
  * git clone https://github.com/SSU-CS-Department/santarosa-mapping.git
2. Make sure you're on the correct branch
  * git checkout web-dev-leaflet (or whichever branch you want to work on)
3. Make sure Nodejs is installed
  * https://nodejs.org/en/
4. Run npm install from the santarosa-mapping/web-dev-leaflet directory
5. Make sure you have a MongoDB database running
  * https://www.mongodb.org/
6. Make sure you're connecting to that database in the web-dev-leaflet/app.js file
  * Example: mongoose.connect('mongodb://localhost/sr-mapping');
7. For the video upload functionality, you must have ffmpeg installed (see below)
  * We do the conversions with bash scripts. If you're running the server on Windows, this may be a problem.
  * Note that the website should function without ffmpeg (or bash), as long as you don't upload videos
8. Start the server
  * Run npm start from the web-dev-leaflet directory
  * If using [Webstorm](https://www.jetbrains.com/webstorm/) (Recommended), set up a new NodeJS run configuration
    * Node interpreter example (Windows): C:\Program Files\nodejs\node.exe
    * Working directory example (Windows): C:\Users\santarosa-mapping\web-dev-leaflet
    * Javascript file: bin/www
    * The other fields can be left blank
9. Open a browser and navigate to localhost:8000
10. If the website does not start, check the nohup.out file. This file will tell you if you are missing any
    dependencies or library. If you are missing anything, run the command: "npm install <missing dependency/library name>".
    (NOTE: this may take a few minutes)

# Third-party Documentation

### [ArcGIS REST API](http://resources.arcgis.com/en/help/rest/apiref/)

* GET or POST to the REST endpoints specified by the ArcGIS REST API to manipulate data from ArcGIS servers manually.
* Typically, this will only be necessary server-side, as you can use [Esri Leaflet](http://esri.github.io/esri-leaflet/) client-side.

### Front-end 

* [Esri Leaflet](http://esri.github.io/esri-leaflet/), which extends [Leaflet.js](http://leafletjs.com/)
  * This is the API used to display the map.
* [jQuery](http://jquery.com/)
  * jQuery makes front-end JavaScript cleaner, and it is required by some of the other technologies we use.
* [Bootstrap v3](http://getbootstrap.com/)
  * Bootstrap v3 is used to style the website
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/icons/)
  * We use Font Awesome icons for many elements, including the icons on the map pins
* [bootstrap-select](http://silviomoreto.github.io/bootstrap-select/)
  * We use this for the dropdown menus in our sidebar
* [Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)
  * We use this to style the pins on our map
* [JSSor Full-width Slider](http://www.jssor.com/demos/full-width-slider.slider)
  * This is the slider for the pictures on our initial view

### Back-end

* [EJS](http://www.embeddedjs.com/)
  * This is the view engine we're using. It allows us to render views with dynamic data.
* [Express](http://expressjs.com/)
  * Express allows us to easily define functions to handle incoming requests (GET or POST).
* [Mongoose](http://mongoosejs.com/)
  * This provides the interface between the NodeJS server and the MongoDB database.
* [Multer](https://www.npmjs.com/package/multer)
  * This allows us to work with HTML5 multi-part/FormData sent to the server.
* [nodemailer](http://nodemailer.com/)
  * This is used to send the emails for the "Report Inappropriate" functionality.
* [request](https://www.npmjs.com/package/request)
  * This makes it easy to send requests to the ArcGIS server (or other servers, if necessary).



# Video Conversion

In order for the video conversion to work the server this is running on
will need to have ffmpeg installed. The scripts convertWEBM.sh and
convertMP4.sh both use ffmpeg to convert the original video file to formats
that will play on all browsers. The converted videos are stored in the
public/videos folder. Two copies will be stored in that file, the .mp4 file
and the .webm file. .mp4 format can be played on almost all browsers, safari,
google chrome for win/max os, and firefox for mac os. The webm format is for
playing in firefox on Windows. Following are links to help get ffmpeg installed and
how to use it. NOTE: Dewey already has ffmpeg installed on it, so running it off of dewey
will not require an install of ffmpeg. SECOND NOTE: You can run the website on a server
without ffmpeg installed on it but video uploads will not work and will result in a crash.

For documentation and mac, windows, and ubuntu downloads:
* http://www.ffmpeg.org/
* https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg

For information on how to use:
* http://www.hongkiat.com/blog/ffmpeg-guide/
* http://www.ffmpeg.org/

# Other notes

* The report email address is santarosamapping@gmail.com. As of this writing, this password is sr-mapping1.
* Videos are difficult to work with. We suggest considering using YouTube if you want to continue using them.
* If you're looking for a place to start, consider checking the TODOs in the code.
