const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const membershipInfo = require('../model/membershipInfoEntity');
const {verifyToken} = require('../utils/authUtils');

/** Create an event */
router.post('/', (req, res) => verifyToken(req, res,
    (decoded) => {
        if(decoded.role === 'admin') {
            return membershipInfo.create(req.body,
                (err, membershipInfo) => err ? res.status(500)
                    .send('Internal Server Error: Unable to create new membership info') :
                    res.status(201)
                        .send({message: 'New membership info created!', id: membershipInfo._id}));
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Update an event */
router.put('/:id', (req, res) => verifyToken(req, res,
    (decoded) => {
        if(decoded.role === 'admin') {
            return membershipInfo.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true},
                (err, found) => err ? res.status(400)
                    .send(`Unable to update the record: ${err}`) :
                    res.status(204).send({message: 'Membership Info updated!', id: found._id}));
        }
        return res.status(403).send('Permission is restricted');
    }));

/** Get events */
router.get('/', (req, res) => verifyToken(req, res,
    () => {
        //If no query params, return all the membership info
        if(Object.keys(req.query).length === 0) {
            return membershipInfo.estimatedDocumentCount((err, count) => {
                if(err) {
                    return res.status(500).send(`Internal Server Error: ${err}`);
                } else if (count > 0) {
                    return membershipInfo.find((error, infos) => error ?
                        res.status(500).send(`Internal Server Error: ${error}`) :
                        res.status(200).send(infos));
                } else {
                    return res.status(200).send('There are no membership info');
                }
            })
        } else if(req.query.memberId) {
            return membershipInfo.findOne({memberId: req.query.memberId},
                (err, info) => err ? res.status(500)
                    .send('Internal Server Error: Unable to find any membership info') :
                    res.status(200).send(info));
        }
        return res.status(500).send('Internal Server Error: Unable to find any membership info')
    }));

/* Get a membershipInfo by its ID */
router.get('/:id', (req, res) => verifyToken(req, res,
    () => membershipInfo.findById(req.params.id,
        (err, info) => err ? res.status(500)
            .send('Internal Server Error: Unable to find any membership info') :
            res.status(200).send(info))));

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req, res,
    (decoded) => {
        if(decoded.role === 'admin') {
            return membershipInfo.findOneAndDelete({_id:req.params.id},
                (err, event) => err ? res.status(500)
                    .send('Internal Server Error: Unable to find any event') :
                    res.status(200)
                        .send({id: event._id, status: 'deleted', message: 'record is deleted'}));
        }
        return res.status(403).send('Permission is restricted');
    }));

module.exports = router;