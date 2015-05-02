// Setup
var express = require('express');
var app = express();
var request = require('request');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Use Jade for our views
app.set('view engine', 'jade');


// Setup index page
app.get('/', function(req, res) {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body ) {
		body = JSON.parse(body);
		
		var rnd = Math.floor( Math.random() * 25 );
		var stream_name = body["streams"][rnd]["channel"]["name"];

		res.render('index.jade', { stream : stream_name, games : topGames  });
	});
});


app.post('/', function(req, res) {
	res.redirect( 'yolobitch' );
	console.log(req.body);
});

// A list of topStreams and topGames
var topStreams = ["temparh"];
var topGames = ["Dota 2"];


// Updates the top games
function updateGames() {
	request('https://api.twitch.tv/kraken/games/top?limit=20', function( err, response, body) {
		body = JSON.parse(body); // Converts response to JSON

		topGames = [];
		// Loops through games and adds them to the table
		for ( i = 1; i < 20; i++ ) {
			topGames.push( body["top"][i]["game"]["name"] );
		};
	});
};
updateGames();


// Updates the top streams
function updateStreams() {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body ) {
		body = JSON.parse(body); // Converts response to JSON
		topStreams = ["temparh"];
		for ( i = 1; i < 25; i++ ) {
			topStreams.push( body["streams"][i]["channel"]["name"] );
		};
		console.log("done");
	});
};


// Returns a stream from the top 25 streams on Twitch
function getRandomStream() {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body){
		body = JSON.parse(body);
		var rnd = Math.floor( Math.random() * 25 );
		callback(body["streams"][rnd]["channel"]["name"]);
	});
};


// Returns a random stream name
function returnRandomStream() {
	updateStreams();
	var rnd = Math.floor( Math.random() * 25 );
	return topStreams[rnd];
};




// List website
app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

function guessNow() {
	res.render("fuck.jade");
};