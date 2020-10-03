const mongoose = require('mongoose');

const allSoulsFeast = new mongoose.Schema({
    memberId: String,
    requestor: String,
    email: String,
    soulName: String,
    modified: { type: Date, default: Date.now },
    created: Date,
    deleted: Boolean
});
mongoose.model('allSoulsFeast', allSoulsFeast);

module.exports = mongoose.model('allSoulsFeast');