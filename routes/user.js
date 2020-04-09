const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const bcrypt = require('bcryptjs');
const {verifyToken} = require('../utils/authUtils');

//use user model schema
const User = require('../model/userEntity');

/* Register a new user*/

router.post('/register', (req, res) => 
  User.findOne({
	username: req.body.username
  }, (err, user) => {
	if(err)
	  return res.status(500).send(`Internal Server Error: ${err}`);
	//Create a user if it does not exist  
	if(user === null || user === undefined) {
	  const pwd = bcrypt.hashSync(req.body.password, 8);
	  return User.create({
		username: req.body.username,
		password: pwd,
		role: req.body.role
	  }, (err, user) => err ? res.status(500).send(`Internal Server Error: ${err}`) : res.status(201).send({id:user._id}));
	}
	return res.status(400).send('User already existed');
  }));
 
/* Get User by id*/
router.get('/:id', (req, res) => verifyToken(req, res, 
	() => User.findById(req.params.id, (err, user) => err ? res.status(404).send('User not found') : res.status(200).send({id: user._id, username:user.username}))));
	
module.exports = router;
