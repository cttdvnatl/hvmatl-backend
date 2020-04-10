const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const {verifyToken} = require('../utils/authUtils');
const config = {
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD
};

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Create an event */
router.post('/',
    (req, res) => verifyToken(req, res,
        (decoded) => {
            if(decoded.role === 'admin') {
                return sftp.connect(config).then(() => sftp.put(req.body.localSrc, req.body.remote).then(
                    () => res.status(201).send({message: 'File upload successfully!'}),
                    (err) => res.status(400).send({message: err}))).finally(() => sftp.end());
            }
            return res.status(403).send('Permission is restricted');
        }));

module.exports = router;