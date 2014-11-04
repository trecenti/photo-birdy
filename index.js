var watch = require('watch')
  , fs = require('fs')
  , request = require('request')
  , utf8 = require('utf8');

// Twitter OAuth
var oauth = {
  consumer_key: 'consumer_key',
  consumer_secret: 'consumer_secret',
  token: 'token',
  token_secret: 'token_secret'
};

function updateStatus(mediaId) {
  var statusOptions = {
    url: 'https://api.twitter.com/1.1/statuses/update.json',
    formData: { status: utf8.encode('New photo!'), media_ids: mediaId },
    oauth: oauth
  };

  request.post(statusOptions, function(err, res, body) {
    if (err) { throw err; }

    console.log('status update: ', res.statusCode);
  });
}

function uploadImage(file) {
  var uploadOptions = {
    url:'https://upload.twitter.com/1.1/media/upload.json',
    oauth:oauth,
    formData: { media: fs.createReadStream(file) }
  };

  request.post(uploadOptions, function(err, res, body) {
    var mediaId;

    if (err) { throw err; }

    console.log('upload image: ', res.statusCode);
    mediaId = JSON.parse(body).media_id.toString();

    updateStatus(mediaId);
  });
}

watch.createMonitor('./photos', function (monitor) {
  monitor.on("created", function (file, stat) {
    console.log('new file:', file);

    uploadImage(file);
  });
})
