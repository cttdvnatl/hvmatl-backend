const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const omit = require('lodash/omit');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const imageModel = require('../model/ImageSchema');
const {verifyToken} = require('../utils/authUtils');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'routes/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var store = multer({ 
    storage: storage,
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
        return cb(new Error('This is not a correct format of the file'))
        cb(undefined,true)
    }
});


router.get('/', (req, res) => {
    imageModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});

// Step 8 - the POST handler for processing the uploaded file

router.post('/image', store.single('image'), (req, res, next) => {

	var obj = {
		name: req.body.name,
		description: req.body.description,
		image: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: req.body.contentType
		}
	}

    return imageModel.create(obj,
        (err, imageModel) => err ? res.status(500)
            .send('Internal Server Error: Unable to create new image') :
            res.status(201)
                .send(omit({...imageModel._doc}, 'image')));
});

// router.put('/image/:id', (req, res) => {

//     var obj = {
// 		name: req.body.name,
// 		description: req.body.description,
// 		image: {
// 			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
// 			contentType: req.body.contentType
// 		}
// 	}

//     return imageModel.findByIdAndUpdate(req.params.id, obj, {new:true, runValidators:true},
//         (err, found) => err ? 
//             res.status(400).send(`Unable to update image: ${err}`) :
//             res.status(204).send({message: `Updated Image found._id`, id: found._id}));
// });


module.exports = router;