const express = require('express');
const bodyParser = require('body-parser');

//Setup router
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

module.exports = router;