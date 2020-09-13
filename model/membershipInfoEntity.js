const mongoose = require('mongoose');

const membershipInfo = new mongoose.Schema({
    firstName: String,
    lastName: String,
    memberId: String,
    email: String,
    msg: String,
    approved: Boolean,
    verified: Boolean
});
mongoose.model('membershipInfo', membershipInfo);

module.exports = mongoose.model('membershipInfo');