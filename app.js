var express = require('express');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var BasicRestController = require('./basic-rest-controller');
var ejs = require('ejs');
var moment = require('moment');
var passport = require('passport');
var flash = require('connect-flash');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo/es5')(expressSession);
var cronMailer = require('./corn-mailer');
require('./passport/login')(passport);


console.log('---=== STARTING APP ===---');

if (!fs.existsSync("./config.js")) {
  console.log("Config file doesn't exist");
  module.exports = [];
  process.exit();
}

var config = require('./config.js');

var app = express();


var controllers_path = './controller';
var rest_controllers_path = './rest-controller';
var models_path = './model';
var routes_path = './routes';
var port = process.env.PORT || '3000';
var environment = process.env.environment || 'production';


controllers = {};
restControllers = {};
models = {};
routes = {};

// Autoload routes, models and controllers
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading controller: ' + file);
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file);
  }
});
fs.readdirSync(rest_controllers_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading controller: ' + file);
    restControllers[file.split('.')[0]] = require(rest_controllers_path + '/' + file);
  }
});
fs.readdirSync(models_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading model: ' + file);
    models[file.split('.')[0]] = require(models_path + '/' + file);
  }
});
fs.readdirSync(routes_path).forEach(function (file) {
  if (file.indexOf('.js') !== -1) {
    console.log('loading route: ' + file);
    routes[file.split('.')[0]] = require(routes_path + '/' + file);
  }
});

//Add missing properties from BasicRestController to loaded restControllers
var BasicRestControllerProperties = Object.getOwnPropertyNames(BasicRestController);
for (var controllerName in restControllers) {
  var controller = restControllers[controllerName];
  for (var index in BasicRestControllerProperties) {
    propertyName = BasicRestControllerProperties[index];
    if (!controller.hasOwnProperty(propertyName)) {
      console.log('Added ' + propertyName + ' to ' + controllerName + ' controller');
      controller[propertyName] = BasicRestController[propertyName];
    }
  }
}

//Load rest routes
var restRouters = require('./auto-rest-router');

// connect to database
mongoose.connect(config.db.url);
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error!');
  throw err;
});
console.log('Connected to DB');

//Set app env
app.set('env', environment.toString());

// prepare passport
app.use(expressSession({
  secret: (process.env.SECRET || 'SuperSecretString-1dfgsdfgdg467890oifdh'),
  store: new MongoStore(
    {mongooseConnection: mongoose.connection},
    function (err) {
      if (err) {
        console.error('connect-mongodb error');
        throw err;
      }
    })
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  models.user.findById(id, function (err, user) {
    done(err, user);
  });
});

// use Express middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(flash());

// Setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Date filters for efs
app.locals.datetimeFormater = function (date, format) {
  if (format) {
    return moment(date).format(format);
  }
  return moment(date).format('DD-MM-YYYY HH:mm');
};

//Static content - public dir
app.use(express.static(path.join(__dirname, 'public')));

//Add routes
for (var r in routes) {
  var route = routes[r];
  app.use(route.prefix || '/', route);
}
app.use('/', restRouters);

// 404 (not found) error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send('error: ' + err.message + "\n\r" +
    (app.get('env') === 'development' ? err : {})
    );
  console.error("\033[31m Error");
  console.error(err);
});

// Start cron mailer
cronMailer();

app.listen(port, function () {
  console.log('Environment: ' + app.get('env'));
  console.log('Server time: ' + (new Date()).toString());
  console.log('App listening on port ' + port);
});

module.exports = app;
