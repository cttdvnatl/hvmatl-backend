const mongoose = require('mongoose');

const WeeklyNews = new mongoose.Schema({
        date : Date,
        title: String,
        image: String,
        src: String
    });
mongoose.model('WeeklyNews', WeeklyNews);

module.exports = mongoose.model('WeeklyNews');