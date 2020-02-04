const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const auth = require('./auth');

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
	  const pwd = bcrypt.hashSync(req.body.password, 8);
	  return User.create({
		username: req.body.username,
		password: pwd
	  }, (err, user) => {
		if(err)
		  return res.status(500).send(`Internal Server Error: ${err}`);
		return res.status(201).send({id:user._id});
	  })
	}
	return res.status(400).send('User alredy exists');
  })
});

/* Find User by id*/
router.get('/:id', (req, res) => {
  const token = req.headers['authorization'].replace('Bearer ','');
  if(token) {
	return auth.verifyToken(token, (err) => {
	  if(err)
		return res.status(403).send("Access denied");
	  User.findById(req.params.id, (err, user) => {
		if(err)
		  return res.status(404).send(`User not found`);
		return res.status(200).send(user);
	  })
	});
  }
  return res.status(403).send('Access denied');
});

module.exports = router;
