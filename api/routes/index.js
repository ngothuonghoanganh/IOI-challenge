let express = require('express');
let router = express.Router();
// var mongoose = require("mongoose");
// mongoose.set('useFindAndModify', false);
let bodyParser = require('body-parser')
// var dbUrl = 'mongodb+srv://mochen1228:Mochen123!@cluster0-ouxvq.mongodb.net/test?retryWrites=true&w=majority';


let app = express();

let Session = require('../models/models.js').Session;
let QuizsetTag = require('../models/models.js').QuizsetTag;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

// // Connects to MongoDB server
// mongoose.connect(dbUrl, (err) => {
//   console.log("mongodb connected", err);
// })

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log(req)

  res.render('index', {
    title: 'Express'
  });
});



  // modified by Hoan
// change from callback to async
// date: 2020/10/4
router.post('/add-session',async (req, res) => {
  // Create a new session and save to the database
  const pinFilter = {
    roomPIN: req.body.roomPIN
  };

  try{
      const doc = await Session.findOne(pinFilter)

      if (doc) {
        res.sendStatus(200);
      } else {
        let session = new Session(req.body);
        session.save((err) => {
          if (err) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        })
      }

  }catch(err){
    res.sendStatus(500);
  }
  // Session.findOne(pinFilter, function (err, doc) {
  //   console.log("FOUND DOC:", doc)
  //   if (err) {
  //     res.sendStatus(500);
  //   } else {
  //     if (doc) {
  //       res.sendStatus(200);
  //     } else {
  //       var session = new Session(req.body);
  //       session.save((err) => {
  //         if (err) {
  //           res.sendStatus(500);
  //         } else {
  //           res.sendStatus(200);
  //         }
  //       })
  //     }
  //   }
  // })
})

router.get('/get-tags', (req, res) => {
  QuizsetTag.find({}, (err, doc) => {
    console.log("tags " + doc)
    if (doc) {
      res.send(doc)
    }

  })
});

module.exports = router;