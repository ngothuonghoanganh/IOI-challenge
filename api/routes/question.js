const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4')
const app = express();

const QuestionController = require('../controller/question')


router.post("/delete-question", QuestionController.deleteQuestion);

// Adda a new question to a quizset
router.post('/add-question', QuestionController.addQuestion)

// Update a question to a quizset
// 
router.post('/update-question', QuestionController.updateQuestion)
router.get('/getAll-question', QuestionController.getAllQuestions)

router.post('/update-question-status', QuestionController.updateQuestionStatus)



module.exports = router;