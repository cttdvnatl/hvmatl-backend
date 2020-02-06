const express = require('express');
const bodyParser = require('body-parser');

const {verifyToken} = require('../utils/authUtils');

//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const upcomingEvent = require('../model/UpcomingEvent');

/** Create an event */
router.post('/', (req, res) => verifyToken(req.headers['authorization'], (err, decoded) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');
    }
    if(decoded.role === 'admin') {
        return upcomingEvent.create({
            date: req.body.date,
            event: req.body.event
        }, (err, upcomingEvent) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to create upcoming events');
            return res.status(201).send({message: 'Event created!', id: upcomingEvent._id});    
        });
    }
    return res.status(403).send('Permission is restricted');
}));

/** Get events */
router.get('/', (req, res) => verifyToken(req.headers['authorization'], (err) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');    
    }
    //If no query params, return all the events
    if(Object.keys(req.query).length === 0) {
        return upcomingEvent.find({}, (err, events) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to find any event');
            return res.status(200).send(events);    
        });
    }
    //Return the event for the given date 
    if(req.query.date) {
        return upcomingEvent.findOne({date: req.query.date}, (err, event) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to find any event');
            return res.status(200).send(event.event);    
        });
    }
}));

/* Get an event by its ID */
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

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req.headers['authorization'], (err, decoded) => {
    if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');    
    }   
    if(decoded.role === 'admin') {
        return upcomingEvent.findOneAndDelete({_id:req.params.id}, (err, event) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to find any event');    
            return res.status(200).send({id: event._id, status: 'deleted', message: 'record is deleted'});
        });
    } 
    return res.status(403).send('Permission is restricted');
}))

module.exports = router;