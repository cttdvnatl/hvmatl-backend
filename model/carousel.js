const mongoose = require('mongoose');

const CarouselEvent = new mongoose.Schema({
    language: String,
    date: String,
    event: [ {   
        title: [String],
        image: String,
        content:[String],
        button: {
            title: String,
            action: String
        }
    }],

});
mongoose.model('CarouselEvent', CarouselEvent);

module.exports = mongoose.model('CarouselEvent');