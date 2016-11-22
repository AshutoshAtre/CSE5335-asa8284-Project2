var express = require('express');
var fs = require('fs');
var app = express(); 						
var port = process.env.PORT || 8081; 				
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require ("mongoose");
var MongoClient = require('mongodb').MongoClient;
var moviesData = { "movies": []};
// mongo URI
var databaseURI = process.env.MONGODB_URI || 'mongodb://AshuDbUser:MongoPwd123!@ds159237.mlab.com:59237/project_db';
var db;

app.use(express.static('./public')); 		
app.use(bodyParser.urlencoded({'extended': 'true'})); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({type: 'application/vnd.api+json'})); 
app.use(methodOverride('X-HTTP-Method-Override'));

// routes
//require('./routes.js')(app);

//connect to database and only if connection is established then start the server
MongoClient.connect(databaseURI, function (err, database) {
  if (err) {
    console.log("Error connecting database: ");
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
  //console.log(db);
  console.log(databaseURI);

  // Initialize the app.
  var server = app.listen(port || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

/* REST Endpoints */

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html'); 
});

app.get('/connectToDatabase', function(req, res){
  var collection = db.collection("movie");
  collection.find().toArray(function(err, docs){
    moviesData = {"movies": []};
    docs.forEach(function(doc){
      moviesData.movies.push(doc);
    });
    res.send({'length': moviesData.movies.length});
  });
});

app.get('/getMovie/:movieNumber', function(req, res){
  var movieNumber = req.params.movieNumber;
  var i = 0;
  var data = moviesData.movies;
  data.forEach(function(movie){
    if(i == movieNumber){
      res.send(movie);
    }
    i++;
  });
});

app.get('/getData', function (req, res) {
   fs.readFile( __dirname + "/public/data/" + "data.json", 'utf8', function (err, data) {
      //console.log( data ); 
      res.end( data );
   });
});

/*app.listen(port);
console.log("App listening on port " + port);*/