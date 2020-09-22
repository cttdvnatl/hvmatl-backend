const mongoose = require('mongoose');

const prayerReq = new mongoose.Schema({
    soulName: String,
    email: String,
    phone: String,
    massDate: Date,
    massTime: String,
    memberId: String,
    message: String
});
mongoose.model('prayerReq', prayerReq);

module.exports = mongoose.model('prayerReq');