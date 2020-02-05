const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const {verifyToken} = require('../utils/authUtils');

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
router.get('/:id', (req, res) => verifyToken(token, (err) => {
	if(err) {
        if(err === 'invalid token')
            return res.status(403).send('Unauthorized Access');
        return res.status(500).send('Internal Server Error: Unable to verify token');
    }
	return User.findById(req.params.id, (err, user) => {
		if(err)
		  return res.status(404).send(`User not found`);
		return res.status(200).send({id: user._id, username:user.username});
	  })
}));

module.exports = router;
