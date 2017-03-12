'use strict';

var express = require('express');
var path = require('path');
var stormpath = require('express-stormpath');

var app = express();  // creates the Express application

app.set('trust proxy', true);

/**
 * We need to setup a static file server that can serve the assets for the angular application.
 * We don't need to authenticate those requests, so we setup this server before we initialize Stormpath.
 */
app.use('/', express.static(path.join(__dirname, '..'), {redirect: false}));

app.use(function (req, rest, next) {
  console.log(new Date, req.method, req.url);
  next();
});

console.log('Intializing Stormpath');

app.use(stormpath.init(app, {
  web: {
    // produces ['text/html'],
    spa: {
      enabled: true,
      view: path.join(__dirname, '..', 'index.html')
    },
    me: {
      // enabled: false,
      expand: {
        customData: true,
        groups: true
      }
    }
  }
}));

app.route('/*')
  .get(function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

// start the web server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Application running at http://localhost:' + part);
});
