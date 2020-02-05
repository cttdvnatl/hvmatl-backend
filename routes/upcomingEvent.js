const express = require('express');
const bodyParser = require('body-parser');

const {verifyToken} = require('../utils/authUtils');

//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const upcomingEvent = require('../model/UpcomingEvent');

router.post('/', (req, res) => verifyToken(req.headers['authorization'], (err) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');
    }
    return upcomingEvent.create({
        date: req.body.date,
        event: req.body.event
    }, (err, upcomingEvent) => {
        if(err)
            return res.status(500).send('Internal Server Error: Unable to create upcoming events');
        return res.status(201).send({message: 'Event created!', id: upcomingEvent._id});    
    });
}));

router.get('/:id', (req, res) => verifyToken(req.headers['authorization'], (err) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');    
    }   
    return upcomingEvent.findById(req.params.id, (err, event) => {
        if(err)
            return res.status(500).send('Internal Server Error: Unable to find any event');
        return res.status(200).send(event);    
    }) ;
}))

router.get('/:date', (req, res) => verifyToken(req.headers['authorization'], (err) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');    
    }
    console.log(req.params.date);   
    return upcomingEvent.findOne({date: req.params.date}, (err, event) => {
        if(err)
            return res.status(500).send('Internal Server Error: Unable to find any event');
        return res.status(200).send(event.event);    
    }) ;
}))
module.exports = router;