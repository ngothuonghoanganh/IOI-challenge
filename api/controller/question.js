const Question = require('../models/models.js').Question
const Answer = require('../models/models.js').Answer
const Err = require('../models/models.js').Error;
const User = require('../models/models.js').User
const jwt = require('jsonwebtoken')


module.exports = {
  async deleteQuestion(req, res) {

    try {
      await Answer.findOneAndDelete({
        "questionId": req.query.questionId
      })

      await Question.findOneAndDelete({
        "_id": req.query.questionId
      })

      return res.send("delete success")
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      return res.status(400);
    }

  },

  async addQuestion(req, res) {
    try {

      console.log(req.body)
      const {
        questions,
        answers,
        type,
        token,
        status
      } = req.body
      let user
      console.log(token)
      if(!(token === undefined || token === null)){

        user = await jwt.verify(token, "ichallenge")
      } 
      console.log(user)
      const question = await Question.create({
        content: questions.content,
        time: questions.time,
        topic: type,
        user: user ? user._id : null,
        status: status
      })

      console.log(question.toJSON()._id)
      const answer = await Answer.create({
        questionId: question.toJSON()._id,
        option1: answers.option1,
        option2: answers.option2,
        option3: answers.option3,
        option4: answers.option4,
        answer: answers.answer,
      })

      return res.send({
        question: question,
        answer: answer
      })
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      return res.status(400);
    }
  },

  async updateQuestion(req, res) {
    try {
      const {
        questions,
        answers
      } = req.body
      await Question.updateOne({
        "_id": req.query.questionId
      }, {
        content: questions.content,
        time: questions.time,
        topic: req.body.type,
      })

      await Answer.updateOne({
        "questionId": req.query.questionId
      }, {
        option1: answers.option1,
        option2: answers.option2,
        option3: answers.option3,
        option4: answers.option4,
        answer: answers.answer,
      })

      return res.send("update success")
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      return res.status(400);
    }
  },
  async getAllQuestions(req, res) {
    try {
      let questions = await Question.find({})

      for (let i = 0; i < questions.length; i++) {
        questions[i] = questions[i].toJSON()
        let answer = await Answer.findOne({ 'questionId': questions[i]._id })
        console.log(answer)
        questions[i].option1 = answer.option1
        questions[i].option2 = answer.option2
        questions[i].option3 = answer.option3
        questions[i].option4 = answer.option4
        questions[i].answer = answer.answer
        console.log(questions[i].user)
        if (questions[i].user !== null && questions[i].user !== undefined) {
          let user = await User.findOne({'_id':questions[i].user})
          if(user){
            console.log(user)
            user = user.toJSON()
            delete user.password
            questions[i].user = user
          }
        }
      }
      return res.send(questions);
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      return res.status(400);
    }
  },

  async updateQuestionStatus(req, res) {
    try {
      await Question.updateOne({
        "_id": req.query.questionId
      }, {
        status: req.body.status
      })

      res.send('update status success')
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      return res.status(400);
    }
  }
}