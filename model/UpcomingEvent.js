const mongoose = require('mongoose');

const UpcomingEvent = new mongoose.Schema({
    date: [{
        title: String,
        image: String,
        content:[String],
    }]
});
mongoose.model('UpcomingEvent', UserSchema);

module.exports = mongoose.model('UpcomingEvent');