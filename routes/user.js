const express = require('express');
const bodyParser = require('body-parser');

//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//user user model schema
const User = require('../model/User');

/* Register a new user*/
router.post('/register', function(req, res) {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if(err)
      return res.status(500).send(`Internal Server Error: ${err}`);
    //Create a user if it does not exist  
    if(user === null) {
      return User.create({
        username: req.body.username,
        password: req.body.password
      }, (err, user) => {
        if(err)
          return res.status(500).send(`Internal Server Error: ${err}`);
        return res.status(201).send(user);
      })
    }
    return res.status(400).send('User alredy exists');
  })
});

/* Find User by id*/
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if(err)
      return res.status(404).send(`User not found: ${err}`);
    return res.status(200).send(user);
  })
});

module.exports = router;
