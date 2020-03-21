const mongoose = require('mongoose');

const UpcomingEventSchema = new mongoose.Schema({
    language: String,
    date: String,
    event: [ {   
        title: [String],
        image: String,
        content:[String],
    }],
    button: {
        title: String,
        action: String
    }
});
mongoose.model('UpcomingEvent', UpcomingEventSchema);

module.exports = mongoose.model('UpcomingEvent');