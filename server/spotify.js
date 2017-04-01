const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const spotify = {};

// setting up OAuth
var spotifyApi = new SpotifyWebApi({
  clientId: '54bedf22a6d14ef7bd7b63ed0c039ee2',
  clientSecret: 'adde660ddced4de5acb268bd5f2d93ad',
  redirectUri: 'http://www.example.com/callback'
});

// get token from https://developer.spotify.com/web-api/console/get-playlist/
// token expires every hour
spotifyApi.setAccessToken('BQCpDptHjFAjLSJOmnr4oB1Uj-N_bDrAcUWgbcPWAEbVnRIO9lY7jVIu1hSEuVIaiSwOZWaxHZikEdsHdS4CBsNkDxOtBcNUJaEIErbO4NvkZ4uS9ROqqAHkclw66TVUFYAAUVXz_c5rxW1rBd0tLJxSovd6_Kv3p-hXmNu07dDS-17RocN9J5l5YmvUUb5k78GaUKPcwRqbyEMqBCo047Gg6BAVjZtlqu43AwqORTWnlu2GzoMYVhrDbb8asvyMaREGrR1Qhsmr671PqMuNAzShdRUDvbD7F-uGe1dGF6gsKvx251fB3w');

spotify.fetchPlaylist = (req, res, next) => {
  // initialize collection to send to front-end
  var allSongs = [];
  var songIdArr = [];

  // fetch playlist
  spotifyApi.getPlaylist('thefader', '32iM8mNTbXeWZ7GKl32Heg')
    .then(function (data) {
      var songArr = data.body['tracks']['items'];
      songArr.forEach(function (x) {
        songObj = {};
        songObj['id'] = x['track']['id'];
        songIdArr.push(x['track']['id']);
        songObj['name'] = x['track']['name'];
        songObj['artist'] = x['track']['artists'][0]['name'];
        allSongs.push(songObj);
      });
      res.locals.allSongs = allSongs;
      res.locals.songIdArr = songIdArr;
      return next();
    })
    .catch((err) => {
      res.status(500).send('Error occurred');
      console.log(err);
    })
}

spotify.fetchSongData = (req, res, next) => {
  var songIdArr = res.locals.songIdArr;
  var allSongs = res.locals.allSongs;
  var allSongsFeatures = [];
  var desiredFeatures = ['id', 'energy', 'valence', 'tempo'];
  spotifyApi.getAudioFeaturesForTracks(songIdArr)
    .then(function (data) {
      songObj = {};
      var tempSongArr = data.body['audio_features'];
      for (var i = 0; i < allSongs.length; i++) {
        for (var j = 0; j < tempSongArr.length; j++) {
          if (allSongs[i]['id'] === tempSongArr[j]['id']) {
            Object.assign(allSongs[i], tempSongArr[j]);
          }
        }
      }
      res.locals.allSongs = allSongs;
      return next();
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports = spotify;
