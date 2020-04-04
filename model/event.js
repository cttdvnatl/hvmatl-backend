const mongoose = require('mongoose');

const WeeklyEvent = new mongoose.Schema({
    language: String,
    event: [ {
        title: String,
        header: String,
        content:[String],
    }],

});
mongoose.model('WeeklyEvent', WeeklyEvent);

module.exports = mongoose.model('WeeklyEvent');