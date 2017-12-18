const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoConnection = require('./app/db/mongo-connection');
const session = require('express-session');
const flash = require('express-flash-messages');
const passport = require('passport');
const {Strategy} = require('passport-local');
const {secret, sessionName} = require('./app/config/config');
const User = require('./app/models/user');
const SocketioService = require('./app/service/socketioService');
const setUserMiddleware = require('./app/middleware/set-user');

const indexRoutes = require('./app/routes/index');
const authRoutes = require('./app/routes/auth');
const chatRoutes = require('./app/routes/chat');

const app = express();
app.io = SocketioService.attachEvents();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(mongoConnection());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret,
  name: sessionName,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(setUserMiddleware);

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', chatRoutes);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
