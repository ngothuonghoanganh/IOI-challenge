const mongoose = require('mongoose')

let Room = require('../models/models.js').Room;
let Quizset = require('../models/models.js').Quizset;
let Player = require('../models/models.js').Player;
const Game = require('../models/models.js').Game ;
const Question = require('../models/models.js').Question;
const Answer = require('../models/models.js').Answer;
const Err = require('../models/models.js').Error;
const Season = require('../models/models.js').Season;

module.exports = {
  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4
  async createNewSession(req, res) {
    console.log("create new game ");
    let quizsetObjectID = "";

    // Find the objectid of the quizset that we are going to assign to the session

    console.log(req.body)
    try {
      const quizsetFilter = req.body.topicGameId ? {
        topic: req.body.topicGameId
      } : {}
      // create quizset
      const size = (req.body.size || req.body.size !== 0) ? req.body.size : 10
      const quizs = await Question.aggregate([{
        $match: quizsetFilter
      }, {
        $sample: {
          size: parseInt(size)
        }
      }])
      if (quizs.length === 0) {
        return res.sendStatus(500)
      }
      const idQuizs = []
      quizs.forEach((quiz) => {
        idQuizs.push(quiz._id)
      })

      const set = new Quizset({
        name: "New Quizset",
        quizset: idQuizs
      });
      await set.save()
      // create room
      const filter = {
        _id: set.toJSON()._id
      };

      const doc = await Quizset.findOne(filter);
      quizsetObjectID = doc.id
      let topicGameId = req.body.topicGameId;
      if (topicGameId.valueOf().length === 0 || topicGameId === "" || topicGameId === undefined || topicGameId === null) {
        topicGameId = null
      }
      // const topicGameId = (req.body.topicGameId === undefined || req.body.topicGameId === [] || req.body.topicGameId === "" || req.body.topicGameId === null) ? null : req.body.topicGameId;
      // console.log(topicGameId.valueOf().length)

      // todo
      const room = await Room.create({
        quizset: quizsetObjectID,
        topicGame: topicGameId
      });
      return res.send({
        quizset: set.toJSON(),
        roomPIN: room.roomPIN
      });
      // Room.save().then(function (obj) {
      //   console.log("New game pin:", obj.roomPIN);
      // });
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }
  },

  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async addPlayer(req, res) {
    // Add player to a game session according to the roomPIN

    try {
      // Add player to a game session according to the roomPIN
      const pinFilter = {
        roomPIN: req.body.roomPIN
      };

      // TODO
      const room = await Room.findOne(pinFilter);
      let newPlayer = new Player({
        'nickname': req.body.player
      });
      room.players.push(newPlayer)
      room.save();
      res.sendStatus(200);
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }
  },

  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4 

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async removePlayer(req, res) {
    const pinFilter = {
      roomPIN: req.body.roomPIN
    };
    const removeFilter = {
      nickname: req.body.player
    }

    try {
      await Room.update(pinFilter, {
        $pull: {
          players: removeFilter
        }
      });
      res.sendStatus(200);
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }

    // Room.update(pinFilter, { $pull: { players: removeFilter } }, function (err, status) {
    //   if (err) {
    //     res.sendStatus(500);
    //   } else {
    //     res.sendStatus(200);
    //   }
    // })
  },

  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async removeSession(req, res) {
    const pinFilter = {
      roomPIN: req.query.roomPIN
    };
    try {
      const room = await Room.findOne(pinFilter, {
        '_id': '_id'
      })
      const season = await Season.findOne({
        'status': true
      })
      console.log(season)
      if (season && season.rooms.length > 0 && room) {
        let index = season.rooms.indexOf(room._id);
        if (index > -1) {
          season.rooms.splice(index, 1);
        }
        console.log(season)
      }

      await Room.deleteOne(pinFilter);
      res.sendStatus(200);
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }

    // Room.deleteOne(pinFilter, function (err, Room) {
    //   if (err) {
    //     res.sendStatus(500);
    //   } else {
    //     res.sendStatus(200);
    //   }
    // })
  },
  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4 
  async sessions(req, res) {

    const messages = await Room.find({}, {
      '_id': '_id',
      'roomPIN': 'roomPIN'
    });
    res.send(messages);
    // Room.find({}, (err, messages) => {
    //   res.send(messages);
    // })
  },

  // modified by Hoan
  // change from callback to async
  // date: 2020/9/4 

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async validateGame(req, res) {
    console.log("game pin " + req.body.roomPIN)
    const pinFilter = {
      roomPIN: req.body.roomPIN
    };
    try {
      await Room.findOne(pinFilter);
      res.send({
        result: true
      })
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.send({
        result: false
      })
    }


    // Room.findOne(pinFilter, function(err,Room) { 
    //     console.log("FOUND DOC:", Room)
    //     if (Room) {
    //         res.send({result: true})
    //     } else {
    //         res.send({result: false})
    //     }
    // });
  },

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async addGameTopic(req, res) {
    try {
      const {
        gameTopic,
        description
      } = req.body

      const game = await Game.create({
        name: gameTopic,
        description: description
      })

      res.send(game)
    } catch (error) {
      let err = new Err();
      err.content = error;
      err.save(err);
      res.status(400);
    }
  },

  // modified by Hoan
  // change to try catch
  // date: 2020/9/14
  async listGames(req, res) {
    try {
      const game = await Game.find({})
      console.log(game)
      return res.send(game)
    } catch (error) {
      console.log(error)  
      let err = new Err();
      err.content = error;
      err.save(err);
      res.status(400);
    }
  }
}