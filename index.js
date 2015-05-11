/*---------------------------------------------------
					TO-DO LIST

		- Format whole file.
		- Add Kappa score.
		- Make buttons always align.
		- Make game buttons reshuffle.
		- Add difficulty option.
		- Do it on time??!?"!"?#?!"¤ "
		- Create hints!

---------------------------------------------------*/
// Setup
var express = require('express');
var app 	= express();
var request = require('request');


app.set('port', (process.env.PORT || 5001));
app.use(express.static(__dirname + '/public'));

// Use Jade for our views.
app.set('view engine', 'jade');


/* Setup Variables */

TwitchGame = {
	functions	: 	new Object,
	variables	: 	new Object,
	config		:	new Object,
};

// Shortcuts
var TG 				= TwitchGame.functions;
var TG_v 			= TwitchGame.variables;
var TG_c			= TwitchGame.config;

// Difficulties.
TG_v.easy 		= 5;
TG_v.medium 	= 10;
TG_v.hard 		= 20;
TG_v.insane 	= 40;

// Configurations
TG_c.gameOptions 	= 50;
TG_c.chatLang 		= ['en'];
TG_c.difficulty 	= TG_v.easy;


/*----------------------------
		Functions
-----------------------------*/
// Setup index page.
app.get('/', function(req, res) {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body ) {
		body = JSON.parse(body);

		// Prepare stream list.
		var streams = new String;
		body = body['streams'];
		for (var k in body) {
			if (typeof body[k] != 'object') continue;
			var name = body[k]['channel']['name'];
			var game = body[k]['channel']['game'];

			streams = streams + '|||STREAM|||' + name;
			streams = streams + '|||GAME|||' + game;
		};

		streams = streams.replace('"', "'");

		// Render function and send data to client-side.
		res.render('index', { streams : streams, games : topGames });
	});

	// Make sure the list of games is up to date.
	updateGames();
});


// Shuffles a table.
Array.prototype.shuffle = function() {
	var m = this.length, t, i;

	// While there are still cards to shuffle...
	while (m) {
		i = Math.floor( Math.random() * m-- ); 

		t 		= this[m]; 	// end object
		this[m] = this[i]; 	// set end object to the random card
		this[i] = t;		// take the end object and place it in random card's place.
	};
};


// Goes through array to check for value
// TODO: Check if you can just do if ( value in table ) --
TG.arrayHasValue = function(array, value) {
	if ( typeof array == 'undefined' || !array || typeof value == 'undefined' || !value ) return false;
	if ( array.constructor !== Array ) array = [array];

	for ( var i = 0; i < array.length; i++ ) {
		if ( array[i] == value ) return true;
	};

	return false;
};


// Clamp number
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};


// Chose a random stream.
function choseRandomStream(body, language) {
	if ( typeof language == 'undefined' || !language ) language = 'en';
	if ( !body || typeof body == 'undefined' ) return false;
	var len = body['streams'].length;

	var filtered = [];
	for ( var i = 0; i < 20; i++ ) {
		if ( TG.arrayHasValue(language, body['streams'][i]['channel']['language']) ) {
			filtered.push(body['streams'][i]);
		};
	};	
	if ( filtered.length < 1 ) return false;

	var rnd = Math.floor( Math.random() * len );
	return body['streams'][rnd];
};


// Post process of index page
app.post('/', function(req, res) {
	res.send(req.body);
});


// A list of topStreams and topGames
var topStreams = ['temparh'];
var topGames = ['Dota 2'];


// Updates the top games
function updateGames() {
	request('https://api.twitch.tv/kraken/games/top?limit=' + TG_c.gameOptions, function( err, response, body) {
		body = JSON.parse(body); // Converts response to JSON

		topGames = [];
		// Loops through games and adds them to the table
		for ( var i = 0; i < TG_c.gameOptions; i++ ) {
			topGames.push( body['top'][i]['game']['name'] );
		};

		topGames.shuffle();
	});
};
updateGames();

// Updates the top streams
function updateStreams() {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body ) {
		body = JSON.parse(body); // Converts response to JSON
		topStreams = ['temparh'];
		for ( var i = 0; i < 25; i++ ) {
			topStreams.push( body['streams'][i]['channel']['name'].replace('"', "'") );
		};
	});
};


// Returns a stream from the top 25 streams on Twitch
function getRandomStream() {
	request('https://api.twitch.tv/kraken/streams', function( err, response, body){
		body = JSON.parse(body);
		var rnd = Math.floor( Math.random() * 25 );
		callback(body['streams'][rnd]['channel']['name']);
	});
};


// Returns a random stream name
function returnRandomStream() {
	updateStreams();
	var rnd = Math.floor( Math.random() * 25 );
	return topStreams[rnd];
};


app.get('/correct', function(req, res) {
	res.send('BITCH YOU GUESSED IT!');
});

app.get('/wrong', function(req, res) {
	res.send('WRONG THAT SHIT WAS SOOO WRONG');
});

// List website
app.listen(app.get('port'), function() {
	console.log('Node app is running at localhost:' + app.get('port'));
});