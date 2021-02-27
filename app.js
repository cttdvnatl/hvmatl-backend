const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const cors = require('cors');
// require('dotenv/config');

//Setup db connection
const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log('Connect to MongoDB successfully'), (e) => console.log(e));
//Config routes
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const carousel = require('./routes/carousel');
const weeklyNews = require('./routes/weeklyNews');
const weeklyEvent = require('./routes/weeklyEvent');
const sftp = require('./routes/sftp');
const prayerReq = require('./routes/prayerReqRoute');
const allSoulsFeastRouter = require('./routes/allSoulsFeast');
const upload = require('./routes/upload');
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
app.use('/weeklyNews', weeklyNews);
app.use('/weeklyEvent', weeklyEvent);
app.use('/file', sftp);
app.use('/prayerRequest', prayerReq);
app.use('/allSoulsFeast', allSoulsFeastRouter);
app.use('/upload', upload);
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
