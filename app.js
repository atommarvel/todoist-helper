var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var webhookRouter = require('./routes/webhook');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse header data
app.use(function(req, res, next) {
  res.locals.keys = {};
  // Found under Settings > Integrations > API token
  res.locals.keys.todoist = req.header('Todoist-Api-Key');
  next();
});

app.use('/webhook', webhookRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// api error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({error: err.message});
});

module.exports = app;
