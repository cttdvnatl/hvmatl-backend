const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const weeklyNews = require('../model/weeklyNews');
const {verifyToken} = require('../utils/authUtils');
/** Create an event */
router.post('/', 
(req, res) => verifyToken(req, res, 
    (decoded) => {
        if(decoded.role === 'admin') {
            return weeklyNews.create(req.body, (err, weeklyNews) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to create upcoming events');
                return res.status(201).send({message: 'A weekly news created!', id: weeklyNews._id});
            });
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Update an event */
router.put('/:id', (req, res) => verifyToken(req, res, 
    (decoded) => {
        if(decoded.role === 'admin') {
            return weeklyNews.findByIdAndUpdate(req.params.id, (err, news) => {
                if (err)
                    return res.status(500).send('Internal Server Error: Unable to find any event');
                return res.status(200).send(news);
            });
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Get events */
router.get('/', (req, res) => verifyToken(req, res, 
    () => {
        //If no query params, return all the events
        if(Object.keys(req.query).length === 0) {
            return weeklyNews.find({}, (err, news) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to find any event' + err);
                return res.status(200).send(news);
            });
        }
        //Return the event for the given date
        if(req.query.date) {
            return weeklyNews.findOne({date: req.query.date}, (err, news) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to find any event');
                return res.status(200).send(news ? news : null);
            });
        }
        //Returns all the event in range
        if(req.query.from && req.query.to) {
            return weeklyNews.find({date: {$gte: req.query.from, $lt: req.query.to}}, (err, news) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to find any event');
                return res.status(200).send(news ? news : null);
            });
        }
    }));

/* Get an event by its ID */
router.get('/:id', (req, res) => verifyToken(req, res, 
    () => weeklyNews.findById(req.params.id, (err, news) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to find any event');
            return res.status(200).send(news);
    })));

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req, res, 
    (decoded) => {
        if(decoded.role === 'admin') {
            return weeklyNews.findOneAndDelete({_id:req.params.id}, (err, news) => {
                if(err)
                    return res.status(500).send('Internal Server Error: Unable to find any event');
                return res.status(200).send({id: news._id, status: 'deleted', message: 'record is deleted'});
            });
        }
        return res.status(403).send('Permission is restricted');
    }));

module.exports = router;