const jwt = require('jsonwebtoken');
const verifyToken = (token, callback) => {
    if(token) {
        token = token.replace('Bearer ', '');
        return jwt.verify(token, process.env.TOKEN_DECODE_KEY, {algorithms:['RS512']}, (err, decoded) => callback(err, decoded))
    }
    return callback('invalid token', null);
}
const createToken = (payload) => jwt.sign(payload, process.env.TOKEN_ENCODE_KEY, {algorithm:'RS512', expiresIn: 86400});
module.exports = {createToken, verifyToken};