const express = require('express');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//user user model schema
const User = require('../model/User');

router.post('/', (req, res) => {
    User.findOne({username:req.body.username}, (err, user) => {
        if(err)
            return res.status(500).send('Internal Server Error: Unable to authenticate');
        if(user === null) {
            return res.status(400).send('User does not exist');
        }
        if(bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_ENCODE_KEY, {
                expiresIn: 86400,
                algorithm:'RS512'
            });
            return res.status(200).send({id: user._id, token: token}); 
        }
    });
});

const verifyToken = (token, callback) => jwt.verify(token, process.env.TOKEN_DECODE_KEY, {algorithms:['RS512']}, callback(err, decode));
const createToken = (payload, callback) => jwt.sign(payload, process.env.TOKEN_ENCODE_KEY, {algorithm:'RS512', expiresIn: 86400}, callback(err, token));
module.exports = {router, verifyToken, createToken};