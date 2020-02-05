const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const {verifyToken} = require('../utils/authUtils');

//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const upcomingEvent = require('../model/UpcomingEvent');

router.post('/', (req, res) => {
    if (req.headers['authorization']) {
        const token = req.headers['authorization'].replace('Bearer ');
        return verifyToken(token, (err) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to verify token');
            return upcomingEvent.create({
                date: req.body.date
            }, (err) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to create upcoming events');
                return res.status(201).send('Event created!');    
            })
        })
    }
    return res.status(403).send('Unauthorized Access');
});

module.exports = router;