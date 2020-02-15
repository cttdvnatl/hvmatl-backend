const mongoose = require('mongoose');

const UpcomingEventSchema = new mongoose.Schema({
    date: String,
    event: [ {
        title: [String],
        image: String,
        content:[String],
    }]
});
mongoose.model('UpcomingEvent', UpcomingEventSchema);

module.exports = mongoose.model('UpcomingEvent');