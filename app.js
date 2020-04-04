const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const cors = require('cors');

//Setup db connection
const dbURL = process.env.MONGODB_URL;
// const dbURL = "mongodb+srv://hvmatl:hvmatl@hvmatl-wqthh.gcp.mongodb.net/hvmatl?retryWrites=true&w=majority";

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log('Connect to MongoDB successfully'), (e) => console.log(e));
//Config routes
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const carousel = require('./routes/carousel');
const weeklyEvent = require('./routes/weeklyEvent');

//Setup express server
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/authentication', authRouter);
app.use('/carousel', carousel);
app.use('/weeklyEvent', weeklyEvent);

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
  res.send({message: err.message});
});

module.exports = app;
