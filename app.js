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

// parse header data
app.use(function(req, res, next) {
  res.locals.keys = {};
  // Found under Settings > Integrations > API token
  res.locals.keys.todoist = req.header('Todoist-Api-Key');
  next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// api error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({error: err.message});
});

async function test() {
  /*
3. add topQueue to highest task without a due date (create a command for this)
4. remove topQueue from any other task in the project (create a command for this)
*/
  let topQueueStateMerged = await compileTopQueueState();
  let commandList = new CommandList();
  topQueueStateMerged.candidates.forEach(candidate => {
    commandList.addLabelCommand(candidate, config.topQueueId);
  });
  topQueueStateMerged.fakes.forEach(faker => {
    commandList.removeLabelCommand(faker, config.topQueueId);
  });
  await client.postCommand(commandList);
  console.log("done");
}

async function compileTopQueueState() {
  let projects = await client.getProjects();
  let tasks = await client.getTasks();
  tasks.forEach(task => {
    projects[task.project_id].addTask(task);
  });
  return Object.values(projects)
      .map(project => {
        return project.getTopQueueState();
      })
      .reduce((merged, topQState) => {
        return merged.mergeState(topQState);
      }, new TopQueueState(null, []));
}

test();



module.exports = app;
