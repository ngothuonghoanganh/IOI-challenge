let express = require('express');
let router = express.Router();
let uuidv4 = require('uuid/v4')

let multer = require('multer');
const quizsetController = require('../controller/quizset')

const DIR = './public/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// Get quizset from database
// Required params: 
// quizsetID:
//      type: ObjectID
// router.post("/get-quiz-set", quizsetController.getQuizSet);

// Remove a question from a quizset
// Required params:
// id:
//      type: ObjectId
//      id of the Question object to be deleted
// quizsetID:
//      type: ObjectID

// Get a single question from databse by id
// Required param:
// id:
//      type: ObjectId
//      id of the Question object
router.get('/get-quiz', quizsetController.getquiz)

// Update the name and tags of the quizset
// Required params:
// tag:
//      type: [String]
//      Array of tags
// quizsetID:
//      type: ObjectID
router.post('/update-quizset', quizsetController.updateQuizSet)

// Creates a new quizset
// This action should be done after user has selected "host game"
//      on game join page
// No params needed
router.post('/create-quizset', quizsetController.createQuizset)
router.get('/get-all-quizset', quizsetController.getAllQuizsets);
router.post('/get-tag-quizset', quizsetController.getTagQuizset);

// Post the quiz image
router.post('/upload_image', upload.single('image'), quizsetController.uploadImage)
router.post("/validate-quizset", quizsetController.validateQuizset);

module.exports = router;