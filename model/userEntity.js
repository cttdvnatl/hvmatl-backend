const mongoose = require('mongoose');

const UserEntity = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});
mongoose.model('User', UserEntity);

module.exports = mongoose.model('User');