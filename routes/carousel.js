const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Carousel = require('../model/carouselEntity');
const {verifyToken} = require('../utils/authUtils');

/** Create an event */
router.post('/', (req, res) => verifyToken(req, res, 
(decoded) => {
    if(decoded.role === 'admin') {
        return Carousel.create(req.body, 
            (err, carouselEvent) => err ? res.status(500).send('Internal Server Error: Unable to create upcoming events') : res.status(201).send({message: 'Event created!', id: carouselEvent._id}));
    }
    return res.status(403).send('Permission is restricted');
}));

/** Update an event */
router.put('/:id', (req, res) => verifyToken(req, res, 
    (decoded) => {
        if(decoded.role === 'admin') {
            return Carousel.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true}, 
                (err, found) => err ? res.status(400).send(`Unable to update the record: ${err}`) : res.status(204).send({message: 'Event updated!', id: found._id}));
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Get events */
router.get('/', (req, res) => verifyToken(req, res,
    () => {
        //If no query params, return all the events
        if(Object.keys(req.query).length === 0) {
            return Carousel.estimatedDocumentCount((err, count) => {
                if(err) {
                    return res.status(500).send(`Internal Server Error: ${err}`);
                } else if (count > 0) {
                    return Carousel.find((error, events) => error ? res.status(500).send(`Internal Server Error: ${error}`) : res.status(200).send(events));
                } else {
                    return res.status(200).send('There are no events');
                }
            })
        } else if(req.query.date) {
            if(req.query.language) {
                return Carousel.findOne({date: req.query.date, language: req.query.language},
                    (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send(event ? event.event : null));
            } else {
                return Carousel.findOne({date: req.query.date}, 
                    (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send(event ? event.event : null));
            }
        }
        return res.status(500).send('Internal Server Error: Unable to find any event')
    }));

/* Get an event by its ID */
router.get('/:id', (req, res) => verifyToken(req, res, 
    () => Carousel.findById(req.params.id, 
        (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send(event))));

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req, res, 
    (decoded) => {
        if(decoded.role === 'admin') {
            return Carousel.findOneAndDelete({_id:req.params.id}, 
                (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send({id: event._id, status: 'deleted', message: 'record is deleted'}));
        } 
        return res.status(403).send('Permission is restricted');
    }));

module.exports = router;