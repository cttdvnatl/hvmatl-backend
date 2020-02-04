const express = require('express');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const {createToken} = require('../utils/authUtils');

//Setup router
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//user user model schema
const User = require('../model/User');

router.post('/', (req, res) => {
    User.findOne({username:req.body.username}, (err, user) => {
        if(err)
            return res.status(500).send('Internal Server Error: Unable to authenticate');
        if(user === null) {
            return res.status(400).send('User does not exist');
        }
        if(bcrypt.compareSync(req.body.password, user.password)) {
            const token = createToken({id: user._id, username: user.username});
            return res.status(200).send({id: user._id, token: token}); 
        }
    });
});

module.exports = router;