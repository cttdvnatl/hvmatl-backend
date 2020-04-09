const mongoose = require('mongoose');

const WeeklyNews = new mongoose.Schema({
        date : Date,
        title: String,
        image: String,
    });
mongoose.model('WeeklyNews', WeeklyNews);

module.exports = mongoose.model('WeeklyNews');