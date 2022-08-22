//TODOS:
//Migrate to Pi/Lambda
//Migrate to public --> mitigated
//Migrate to BraveNewSlackChat
//Uniqueness check for adding tracks

require('console-stamp')(console, "[yyyy-mm-dd'T'HH:MM:ss.l]");

const dotenv = require('dotenv');
dotenv.config();

const spotifyTrackPrefix = "https://open.spotify.com/track";
const urlRegex = /\<([^>]+)\>/;

const { App } = require('@slack/bolt');
var SpotifyWebApi = require('spotify-web-api-node');
const url = require('url');


//Initialize spotify app credentials
var credentials = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://localhost:8888/callback'
};

var spotifyApi = new SpotifyWebApi(credentials);

// The code that's returned as a query parameter to the redirect URI
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message(spotifyTrackPrefix, ({ message, say }) => {
  // filter irrelevant channels
  if(process.env.SLACK_CHANNEL_ID != message.channel.toString()){
  	console.log("wrong channel.");
  	return;
  }

  // extract track id
  const urlStr = message.text.match(urlRegex)[1];
  console.log("url string: "+urlStr);
  const spotifyURL = url.parse(urlStr);
  const tIdx = spotifyURL.pathname.split('/').indexOf("track") + 1;
  const trackId = spotifyURL.pathname.split('/')[tIdx];
  console.log("track Id: "+trackId);

//Add to Playlist
// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken().then(
  function(data) {
    console.log('The access token has been refreshed!');
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Could not refresh access token', err);
  }
).then(function(data) {
    return spotifyApi.addTracksToPlaylist(
      process.env.SPOTIFY_PLAYLIST_ID,
      [
        'spotify:track:'+trackId
      ]
    );
  }).then(function(data) {
    console.log('Added tracks to the playlist SUCCESS!');
  })
  .catch(function(err) {
    console.log('Something went wrong!', err.message);
  });  
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('Bolt app is running!');
})();

