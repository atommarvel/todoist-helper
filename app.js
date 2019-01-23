var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
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

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function test() {
  const client = require('./todoist/TodoistClient');
  // TODO: RESUME
  /*
  2. insert all tasks into the appropriate project in the correct order
  3. add topQueue to highest task without a due date (create a command for this)
  4. remove topQueue from any other task in the project (create a command for this)
   */
  let projects = await client.getProjects();
  let tasks = await client.getTasks();
  tasks.forEach(task => {
    projects[task.project_id].addTask(task);
  });
  console.log(projects);
}

test();

module.exports = app;
