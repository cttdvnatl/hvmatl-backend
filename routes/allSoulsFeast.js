const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const allSoulsFeastReq = require('../model/allSoulsFeast');
const {verifyToken} = require('../utils/authUtils');

/** Create an event */
router.post('/', (req, res) => verifyToken(req, res,
    () => {
        return allSoulsFeastReq.create(req.body,
            (err, allSoulsFeastReq) => err ? res.status(500)
                .send('Internal Server Error: Unable to create new allSoulsFeastReq info') :
                res.status(201)
                    .send({message: 'New allSoulsFeastReq Request created!', id: allSoulsFeastReq._id}));
    }));

/** Update an event */
router.put('/:id', (req, res) => verifyToken(req, res,
    (decoded) => {
        if(decoded.role === 'admin') {
            return allSoulsFeastReq.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true},
                (err, found) => err ? res.status(400)
                    .send(`Unable to update the record: ${err}`) :
                    res.status(204).send({message: 'Prayer allSoulsFeastReq updated!', id: found._id}));
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Get events */
router.get('/', (req, res) => verifyToken(req, res,
    () => {
        //If no query params, return all the membership info
        if(Object.keys(req.query).length === 0) {
            return allSoulsFeastReq.estimatedDocumentCount((err, count) => {
                if(err) {
                    return res.status(500).send(`Internal Server Error: ${err}`);
                } else if (count > 0) {
                    return allSoulsFeastReq.find((error, infos) => error ?
                        res.status(500).send(`Internal Server Error: ${error}`) :
                        res.status(200).send(infos));
                } else {
                    return res.status(200).send('No prayer allSoulsFeastReq found')
                }
            })
        } else if(req.query.email) {
            return allSoulsFeastReq.findOne({email: req.query.email},
                (err, info) => err ? res.status(500)
                    .send('Internal Server Error: Unable to find any allSoulsFeastReq request info') :
                    res.status(200).send(info));
        } else if(req.query.fullName) {
            return allSoulsFeastReq.findOne({fullName: req.query.fullName},
                (err, info) => err ? res.status(500)
                        .send('Internal Server Error: Unable to find any allSoulsFeastReq request info') :
                    res.status(200).send(info));
        } else if(req.query.phone) {
            return allSoulsFeastReq.findOne({phone: req.query.phone},
                (err, info) => err ? res.status(500)
                        .send('Internal Server Error: Unable to find any allSoulsFeastReq request info') :
                    res.status(200).send(info));
        } else if (req.query.memberId) {
            return allSoulsFeastReq.findOne({memberId: req.query.memberId},
                (err, info) => err ? res.status(500)
                        .send('Internal Server Error: Unable to find any allSoulsFeastReq request info') :
                    res.status(200).send(info));
        } else if (req.query.from && req.query.to) {
            return allSoulsFeastReq.find({massDate: {$gte: req.query.from, $lte: req.query.to}},
                (err, info) => err ? res.status(500)
                        .send('Internal Server Error: Unable to find any allSoulsFeastReq request info') :
                    res.status(200).send(info));
        }
        return res.status(500).send('Internal Server Error: Unable to find any allSoulsFeastReq request')
    }));

/* Get a allSoulsFeastReq by its ID */
router.get('/:id', (req, res) => verifyToken(req, res,
    () => allSoulsFeastReq.findById(req.params.id,
        (err, info) => err ? res.status(500)
            .send('Internal Server Error: Unable to find any allSoulsFeastReq info') :
            res.status(200).send(info))));

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req, res,
    (decoded) => {
        if(decoded.role === 'admin') {
            return allSoulsFeastReq.findOneAndDelete({_id:req.params.id},
                (err, event) => err ? res.status(500)
                    .send('Internal Server Error: Unable to find any event') :
                    res.status(200)
                        .send({id: event._id, status: 'deleted', message: 'record is deleted'}));
        }
        return res.status(403).send('Permission is restricted');
    }));

module.exports = router;