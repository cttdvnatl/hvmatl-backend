const router = require('./config');
const Carousel = require('../model/carouselEntity');

/** Create an event */
router.post('/', (req, res) => verifyToken(req.headers['authorization'], 
(decoded) => {
    if(decoded.role === 'admin') {
        return Carousel.create(req.body, 
            (err, carouselEvent) => err ? res.status(500).send('Internal Server Error: Unable to create upcoming events') : res.status(201).send({message: 'Event created!', id: carouselEvent._id}));
    }
    return res.status(403).send('Permission is restricted');
}));

/** Get events */
router.get('/', (req, res) => verifyToken(req.headers['authorization'],
    () => {
        //If no query params, return all the events
        if(Object.keys(req.query).length === 0) {
            return Carousel.find({}, 
                (err, events) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send(events));
        }
        //Return the event for the given date 
        if(req.query.date) {
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
router.get('/:id', (req, res) => verifyToken(req.headers['authorization'], 
    () => Carousel.findById(req.params.id, 
        (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send(event))));

/* Delete an event by its ID */
router.delete('/:id', (req, res) => verifyToken(req.headers['authorization'], 
    (decoded) => {
        if(decoded.role === 'admin') {
            return Carousel.findOneAndDelete({_id:req.params.id}, 
                (err, event) => err ? res.status(500).send('Internal Server Error: Unable to find any event') : res.status(200).send({id: event._id, status: 'deleted', message: 'record is deleted'}));
        } 
        return res.status(403).send('Permission is restricted');
    }));

module.exports = router;