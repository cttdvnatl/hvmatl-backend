const router = require('./config');
const bcrypt = require('bcryptjs');
const {createToken} = require('../utils/authUtils');

//user user model schema
const User = require('../model/userEntity');

/**Authenticate a user */
router.post('/', 
    (req, res) => User.findOne({username:req.body.username}, 
        (err, user) => {
            if(err)
                return res.status(500).send('Internal Server Error: Unable to authenticate');
            if(user === null) {
                return res.status(400).send('User does not exist');
            }
            if(bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username, role: user.role});
                return res.status(200).send({id: user._id, token: token}); 
            }
            return res.status(400).send('Invalid password');
        }));

module.exports = router;