require("dotenv").config();
// everything the app requires to run
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");

// spotify API key
var spotify = new Spotify(keys.spotify);

// pulls the 2nd index of the line
var search = process.argv[2];

// switch statement for which subject they search for
switch (search) {
  case "concert-this":
    bands()
    break;
  case "spotify-this-song":
    spotifyFunction()
    break;
  case "movie-this":
    movie()
    break;
  case "doWhatItSays":
    doWhatItSays()
    break;
    // if the user doesn't input anything
  default:
    noInput()

}
// searches the Spotify API
function spotifyFunction() {
  var searching = process.argv[3];
  spotify.search({
    type: 'track',
    query: searching
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    };
    for (var i = 0; i < data.tracks.items.length; i++) {
      if (i === 5) break
      var video = data.tracks.items[i].preview_url || "Not available";
      // * The album that the song is from
      console.log("--------------------")
      console.log("Artist: " + data.tracks.items[i].artists[0].name);
      console.log("Song: " + data.tracks.items[i].name)
      console.log("Video: " + video)
      console.log("Album Name: " + data.tracks.items[i].album.name)
      console.log("--------------------")
    }
  });
}
// searches the OMDB API
function movie() {
  var searching = process.argv[3];
  if (searching) {
    axios.get("http://www.omdbapi.com/?t=" + searching + "&apikey=trilogy").then(
      function (response) {
        console.log("--------------------");
        // title + response.data.title
        console.log("Title: " + response.data.Title);
        //year it came out
        console.log("Year: " + response.data.Year);
        // IMDB Rating of the movie.
        console.log("IMDB: " + response.data.imdbRating);
        // Rotten Tomatoes Rating of the movie.
        console.log("Rotten Tomatos Rating: " + response.data.Ratings[1].Value);
        // Country where the movie was produced.
        console.log("Country where movie was produced: " + response.data.Country);
        // Language of the movie.
        console.log("Language: " + response.data.Language);
        // Plot of the movie.
        console.log("Plot: " + response.data.Plot);
        // Actors in the movie.
        console.log("Actors: " + response.data.Actors);
        console.log("--------------------");
      }
    );
  }
  // if the user doesnt input a movie 
  else {
    axios.get("http://www.omdbapi.com/?t=mr-nobody&y=&plot=short&apikey=trilogy").then(
      function (response) {
        console.log("--------------------");
        console.log("You didn't search for a movie");
        console.log("If you haven't watched " + response.data.Title + " then you should");
        console.log("http://www.imdb.com/title/tt0485947");
        console.log("it's on Netflix!");
        console.log("--------------------");

      }
    )
  }
}
// bands in town API
function bands() {
  var searching = process.argv[3];
  axios.get("https://rest.bandsintown.com/artists/" + searching + "/events?app_id=codingbootcamp").then(
    function (response) {
      // pulls the first 10 responses
      for (var i = 0; i < response.data.length; i++) {
        if (i === 10) break
        console.log("--------------------");
        // name of venue
        console.log("Venue: " + response.data[i].venue.name);
        // Venue location
        console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
        // // Date of the Event (use moment to format this as "MM/DD/YYYY")
        console.log("Date of event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("--------------------");
      }
    }
  )
}

function doWhatItSays() {
  // Pulls the text from the .txt file
  fs.readFile("./random.txt", "utf8", function (err, data) {
    if (err) {
      console.log("Error Occurred!" + err);
    }
    var randomArray = data.split(",");
    // searches spotify using the  .txt file
    spotify.search({
      type: 'track',
      query: randomArray[1]
    }, function (err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }
      console.log("--------------------")
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name)
      console.log("Album Name: " + data.tracks.items[0].album.name)
      console.log("--------------------")
    });
  });
}
// default on the switch. if the user doesnt input anything, or inputs something wrong
function noInput() {
  console.log("Invalid Entry!");
}