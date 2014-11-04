var watch = require('watch')
  , fs = require('fs')
  , request = require('request');

// Twitter OAuth
var oauth = {
  consumer_key: process.env.CONSUMER_KEY || 'consumer_key',
  consumer_secret: process.env.CONSUMER_SECRET || 'consumer_secret',
  token: process.env.TOKEN || 'token',
  token_secret: process.env.TOKEN_SECRET || 'token_secret'
};

// Status Message
var statusMessage = process.argv[2] || 'Criando Laços! #TWAL2014';

function updateStatusWithMedia(file) {
  var statusOptions = {
    url: 'https://api.twitter.com/1.1/statuses/update_with_media.json',
    formData: { status: statusMessage, 'media[]': fs.readFileSync(file) },
    headers: { 'Accept-Charset': 'ISO-8859-1,utf-8' },
    oauth: oauth
  };

  request.post(statusOptions, function(err, res, body) {
    if (err) { throw err; }

    console.log('photo status update: ', res.statusCode);
  });
}

watch.createMonitor('./photos', function (monitor) {
  monitor.on("created", function (file, stat) {
    console.log('new file:', file);

    updateStatusWithMedia(file);
  });
})
