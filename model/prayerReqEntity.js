const mongoose = require('mongoose');

const prayerReq = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    massTime: Date,
    memberId: String,
    message: String
});
mongoose.model('prayerReq', prayerReq);

module.exports = mongoose.model('prayerReq');