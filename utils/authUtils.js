const jwt = require('jsonwebtoken');
const verifyToken = (token, callback) => jwt.verify(token, process.env.TOKEN_DECODE_KEY, {algorithms:['RS512']}, (err, decoded) => callback(err, decoded));
const createToken = (payload) => jwt.sign(payload, process.env.TOKEN_ENCODE_KEY, {algorithm:'RS512', expiresIn: 86400});
module.exports = {createToken, verifyToken};