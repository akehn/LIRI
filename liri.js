// API keys file 
var keys = require("./keys.js");

// NPM packages
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var request = require('request');
const lme = require('lme');

var userCommand = process.argv[2];

// User Commands
switch (userCommand) {
    case "my-tweets":
        myTwitter();
        break;
    case "spotify-this-song":
        mySpotify();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doThis();
        break;
    default:
        console.log('Please type a correct command: \n' +
            "node liri my-tweets\n" +
            "node liri spotify-this-song\n" +
            "node liri movie-this\n" +
            "node liri do-what-it-says\n");
}

// Twitter
// =====================================================================================
function myTwitter() {

    var twitterClient = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    // Log tweet data
    lme.wline("---------------------------------------------------------", 1);
    lme.wline("************** Here are your latest tweets **************", 1);
    lme.wline("---------------------------------------------------------\n", 1);

    var options = {
        screen_name: 'anthonykehn',
        count: 20
    };

    twitterClient.get('statuses/user_timeline', options, function (err, data, response) {
        for (var i = 0; i < data.length; i++) {
            lme.s("Created at: " + (parseInt(i) + 1) + ":  " + data[i].created_at + "\n" +
                "Tweet " + (parseInt(i) + 1) + ":  " + data[i].text + "\n");

        }
        lme.wline("---------------------------------------------------------", 1);
        lme.wline("************** End Of Your Tweets **************", 1);
        lme.wline("---------------------------------------------------------", 1);
    });

}

// Spotify
// =====================================================================================
function mySpotify(songTitle) {

    // Spotify API Access
    var spotifyClient = new Spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });

    // If user did not enter a song, return results for Ace of Base's "The Sign"
    if (process.argv[3] === undefined) {

        // Spotify NPM package
        spotifyClient.search({ type: 'track', query: 'The Sign', limit: 10 }, function (error, data) {

            // Error messaging 
            if (error) {
                return console.log('Error occurred: ' + error);

                // Log "The Sign" data
            } else {
                lme.s("\n--------------------------------------------------------------\n");
                lme.s('Hmm...looks like you did not enter a song title, so here is a Spotify search result for "The Sign" by Ace of Base:\n');
                lme.s(("Artist Name") + ": " + data.tracks.items[8].artists[0].name);
                lme.s(("Song Name") + ": " + data.tracks.items[8].name);
                lme.s(("Song Preview Link") + ": " + data.tracks.items[8].external_urls.spotify);
                lme.s(("Album") + ": " + data.tracks.items[8].album.name);
                lme.s("\n--------------------------------------------------------------");
            }
        });

    } else {
        // Spotify NPM package
        spotifyClient.search({ type: 'track', query: process.argv[3], limit: 10 }, function (error, data) {

            // Error messaging 
            if (error) {
                return console.log('Error occurred: ' + error);

                // Log Spotify data
            } else {
                // Find the length of the response (may be smaller than 10)
                numSearchResults = data.tracks.items.length;
                // If no results found..
                if (numSearchResults === 0) {
                    lme.s("\nSorry, no Spotify results found for \"" + songTitle + "\".\n");
                    // If results found..
                } else {
                    lme.s("\n-------------------------------------------------------------------------------------------");
                    lme.s("************** Here are your top " + numSearchResults + " Spotify results for \"" + songTitle + "\" **************");
                    lme.s("-------------------------------------------------------------------------------------------\n");
                    for (var i = 0; i < numSearchResults; i++) {
                        lme.s("Result " + (parseInt(i) + 1) + ":");
                        lme.s(("\nArtist Name") + ": " + data.tracks.items[i].artists[0].name);
                        lme.s(("Song Name") + ": " + data.tracks.items[i].name);
                        lme.s(("Song Preview Link") + ": " + data.tracks.items[i].external_urls.spotify);
                        lme.s(("Album") + ": " + data.tracks.items[i].album.name);
                        lme.s("\n--------------------------------------------------------------\n");
                    }
                }
            };
        });
    }
}

// Moive IMDB
// =====================================================================================
function movieThis() {

    var userInput = process.argv[3];

    var movieName = userInput;

    if (!movieName) {
        movieName = "mr nobody";
    }

	// Grab the movie name
	var movieName = process.argv[3];

	var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy&r=json';
    
    // console.log(queryUrl);
	request(queryUrl, function(error, response, body) {

		var movieInfo = JSON.parse(body);

		if (!error) {
			lme.s("Title: " + movieInfo.Title);
			lme.s("Release Year: " + movieInfo.Year);
			lme.s("imdb Rating: " + movieInfo.imdbRating);
			lme.s("Country: " + movieInfo.Country);
			lme.s("Language: " + movieInfo.Language);
			lme.s("Plot: " + movieInfo.Plot);
			lme.s("Actors: " + movieInfo.Actors);
			lme.s("Rotten Tomatoes Rating: " + movieInfo.tomatoRating);
            lme.s("Rotten Tomatoes URL: " + movieInfo.tomatoURL);
            lme.wline("*");
		}
	});
}; 

    // "Do What It Says" Function
    // =====================================================================================
    function doThis() {
            fs.readFile("random.txt", "utf8", function(error,data){
                if (error){
                    return console.log(error);
                }
                // console.log(data);
                var array = data.split(",");
                if(array[0]==="spotify-this-song"){
                    mySpotify();
                }
            });
        }


