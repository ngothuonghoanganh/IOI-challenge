let Quiz = require('../models/models.js').Quiz;
let Quizset = require('../models/models.js').Quizset;
let QuizsetTag = require('../models/models.js').QuizsetTag;

const Question = require('../models/models.js').Question;
const Answer = require('../models/models.js').Answer;
const Err = require('../models/models.js').Error;

module.exports = {

  getQuizSet(req, res) {
    // console.log("get-quiz-set " + req.body.quizsetID)

    const filter = {
      _id: req.body.quizsetID
    };

    // Preload the quizzes to the result
    // Array of Quiz objects in the quizset


    Quizset.findOne(filter, async function (err, quizset) {
      // console.log("FOUND DOC:", quizset);
      if (err) {
        res.sendStatus(500);
      } else {
        // Find all the Quiz objects in the quizset using objectIDs
        // in quizset.quizset
        Quiz.find({
          '_id': {
            $in: quizset.quizset
          }
        }, function (err, questions) {
          // console.log('get quiz')
          // console.log(questions)
          res.send({
            quizzes: questions,
            quizset: quizset
          })
        });
      }
    })
  },


  // modified by Hoan
  // change to try catch
  // date: 2020/9/14

  async getquiz(req, res) {
    // console.log("get-quiz " + req.body.id)
    // console.log("add-quiz quiz" + req.body.quiz)
    try {
      let idFilter = {
        _id: req.query.id
      };


      let questions = await Question.findOne(idFilter)
      questions = questions.toJSON()
      let answer = await Answer.findOne({
        'questionId': questions._id
      })
      answer = answer.toJSON()
      questions.option1 = answer.option1
      questions.option2 = answer.option2
      questions.option3 = answer.option3
      questions.option4 = answer.option4
      questions.answer = answer.answer
      console.log(questions)
      return res.send(questions)
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }
    // if (questions) {
    //   res.send(questions);
    // } else {
    //   res.sendStatus(500);
    // }

    // Question.findOne(idFilter, function (err, doc) {
    //   // console.log("FOUND DOC:", doc);
    //   if (doc) {
    //     res.send(doc);
    //   } else {
    //     res.sendStatus(500);
    //   }
    // });
  },

  updateQuizSet(req, res) {
    // console.log("tag " + req.body.tag)

    const filter = {
      _id: req.body.quizsetID
    };


    // modified by Hoan
    // change to try catch
    // date: 2020/9/14
    Quizset.findOne(filter, function (err, set) {
      // console.log("FOUND DOC:", set);
      try {
        // Update name
        set.name = req.body.name
        // Update tags
        // Remove existed tags
        set.tag.forEach(element => {
          QuizsetTag.findOne({
            tag: element
          }, function (err, doc) {
            if (doc) {
              doc.quizset.remove({
                _id: set._id
              });
              doc.save()
            }
          })
        });
        set.tag = req.body.tag
        set.save();

        set.tag.forEach(element => {
          QuizsetTag.findOne({
            tag: element
          }, function (err, doc) {
            if (doc == null) {
              doc = new QuizsetTag()
              doc.tag = element
              // console.log("tag name is " + element)
            }
            doc.quizset.push({
              _id: set._id
            });
            doc.save()
          })
        })
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        res.sendStatus(500);
      }
    })
  },

  async createQuizset(req, res) {
    const quizs = await Question.aggregate([{
      $sample: {
        size: 1
      }
    }])
    const idQuizs = []
    quizs.forEach((quiz) => {
      idQuizs.push(quiz._id)
    })

    const set = new Quizset({
      name: "New Quizset",
      quizset: idQuizs
    });

    set.save().then(function (obj) {
      console.log("New set ID:", obj._id);
      res.send({
        quizsetID: obj._id
      });
    });
  },




  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async getAllQuizsets(req, res) {
    try {
      const doc = await Quizset.find({});

      res.send(doc);
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
    }


    // console.log("get-all-quizset")
    // Quizset.find({}, (err, doc) => {
    //   // console.log("quizsets " + doc)
    //   if (doc) {
    //     res.send(doc)
    //   }
    // })
  },



  getTagQuizset(req, res) {
    // console.log("get-tag-quizset " + req.body.tag)
    QuizsetTag.findOne({
      tag: req.body.tag
    }, (err, doc) => {
      // console.log("quizsets " + doc)
      if (doc) {
        Quizset.find({
          '_id': {
            $in: doc.quizset
          }
        }, function (err, docs) {
          // console.log(docs);
          res.send({
            quizset: docs
          })
        });
      }
    })
  },

  uploadImage(req, res) {
    const url = req.protocol + '://' + req.get('host')
    let filename = url + "/" + req.file.filename;
    res.status(201).json({
      message: "User registered successfully!",
      image: {
        filename: filename
      }
    })
  },



  async validateQuizset(req, res) {
    // console.log("validate-quizset " + req.body.quizsetID)

    const filter = {
      _id: req.body.quizsetID
    };

    // Preload the quizzes to the result
    // Array of Quiz objects in the quizset


    // modified by Hoan
    // change to try catch
    // date: 2020/9/14
    Quizset.findOne(filter, function (err, quizset) {
      // console.log("FOUND DOC:", quizset);
      // if (err) {
      //   res.sendStatus(500);
      //   res.send({
      //     result: false,
      //     message: "Cannot connect database"
      //   })
      // } else {
      //   // Find all the Quiz objects in the quizset using objectIDs
      //   // in quizset.quizset
      //   Question.find({
      //     '_id': {
      //       $in: quizset.quizset
      //     }
      //   }, function (err, questions) {
      //     if (questions == null || questions.length == 0) {
      //       res.send({
      //         result: false,
      //         message: "Please add at least one question in quizset!"
      //       })
      //       return
      //     } else {
      //       let error = false;
      //       questions.forEach((q) => {
      //         // console.log(q)
      //         if (q.content == null || q.content == "") {
      //           error = true;
      //         }
      //       })
      //       if (error) {
      //         res.send({
      //           result: false,
      //           message: "Please fill in all questions you added!"
      //         })
      //       } else {
      //         res.send({
      //           result: true
      //         })
      //       }
      //     }

      //   });


      // }

      try {
        // Find all the Quiz objects in the quizset using objectIDs
        // in quizset.quizset
        Question.find({
          '_id': {
            $in: quizset.quizset
          }
        }, function (err, questions) {
          if (questions == null || questions.length == 0) {
            res.send({
              result: false,
              message: "Please add at least one question in quizset!"
            })
            return
          } else {
            let error = false;
            questions.forEach((q) => {
              // console.log(q)
              if (q.content == null || q.content == "") {
                error = true;
              }
            })
            if (error) {
              res.send({
                result: false,
                message: "Please fill in all questions you added!"
              })
            } else {
              res.send({
                result: true
              })
            }
          }

        });
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        res.sendStatus(500);
        res.send({
          result: false,
          message: "Cannot connect database"
        })
      }
    })
  }
}