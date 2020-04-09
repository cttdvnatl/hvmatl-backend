const mongoose = require('mongoose');

const WeeklyEvent = new mongoose.Schema({
    date: Date,
    image: String,
    events: [
        {
            title: String,
            src: String
        }
    ],
});
mongoose.model('WeeklyEvent', WeeklyEvent);

module.exports = mongoose.model('WeeklyEvent');