const Err = require('../models/models.js').Error;
const Season = require('../models/models.js').Season
const Game = require('../models/models.js').Game
const Room = require('../models/models.js').Room
const Question = require('../models/models.js').Question;
const Quizset = require('../models/models.js').Quizset

module.exports = {
  async addnewSeason(req, res) {
    try {
      const {
        topic,
        content,
        status
      } = req.body
      console.log(topic)
      let oldSeason = []
      if (status === true){
         oldSeason = await Season.find({
          'status': true
        })
      }
      if (oldSeason.length > 0) {
        return res.sendStatus(400)
      }
      const newSeason = await Season.create({
        topicGame: topic,
        content: content,
        status: status
      })
      return res.send(newSeason)
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(400);
    }
  },

  async updateSeason(req, res) {
    try {
      const Id = req.query.Id
      const {
        topicAdd,
        topicRemove,
        content
      } = req.body
      const season = await Season.findOne({
        "_id": Id
      })
      console.log(req.body)
      if (topicRemove.length > 0) {
        topicRemove.forEach(element => {
          season.topicGame = season.topicGame.filter((tag, index) => {
            return tag.topic.toString() !== element.topic.toString()
          })
        })
      }
      season.content = content
      if (topicAdd.length > 0) {
        topicAdd.forEach(element => {
          const condition = season.topicGame.filter((tag, index) => {
            return tag.topic.toString() === element.topic.toString()
          })
          if (condition.length > 0) {
            condition[0].size = element.size
            return;
          }
          season.topicGame.push(element)

          // season.topicGame.map(topicGame => {
          //   console.log(element.topic.toString() === topicGame.topic.toString())
          //   if (element.topic.toString() === topicGame.topic.toString()) return
          //   season.topicGame.push(element)
          // })
          // console.log(a)
        })

      }
      await season.save()
      return res.send(season)
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(400);
    }
  },

  // async removeSeason(req, res) {
  //   try {
  //     const Id = req.query.Id
  //     await Season.deleteOne({ "_id": Id })
  //     return res.send("delete success")
  //   } catch (error) {
  //     console.log(error)
  //     let err = new Err();
  //     err.content = error;
  //     err.save(err);
  //     res.sendStatus(400);
  //   }
  // },

  async getSeasons(req, res) {
    try {
      let seasonsDB = await Season.find({})
      let seasons = []
      for (let season of seasonsDB) {
        season = season.toObject()
        season.Games = []
        season.Rooms = []
        const topicFilter = []
        season.topicGame.forEach(element => topicFilter.push(element.topic))
        const topic = await Game.find({
          '_id': {
            $in: topicFilter
          }
        })
        // console.log(season.topicGame)
        const room = await Room.find({
          '_id': {
            $in: season.rooms
          }
        })

        const result = season.topicGame.map(topicGame => {
          for (const element of topic) {
            // console.log(element)
            if (topicGame.topic.toString() === element.toJSON()._id.toString()) {
              topicGame.name = element.name
              topicGame.description = element.description
            }
          }
          return topicGame
        })

        season.Games = result
        room.forEach(element => {
          season.Rooms.push(element)
        })
        delete season.topicGame
        delete season.rooms

        seasons.push(season)
        // console.log(season)
      }

      res.send(seasons)
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(400);
    }
  },

  async roomAllowSeason(req, res) {

    console.log("create new game ");
    let quizsetObjectID = "";

    // Find the objectid of the quizset that we are going to assign to the session
    try {
      const idQuizs = []

      const seasonDBs = await Season.findOne({
        'status': true
      })
      const seasons = seasonDBs.toJSON()
      let quizsetFilter = {}
      for (const element of seasons.topicGame) {
        quizsetFilter = element ? {
          topic: element.topic.toString()
        } : {}
        // create quizset
        const size = (element.size || element.size !== 0) ? element.size : 10
        const quizs = await Question.aggregate([{
          $match: quizsetFilter
        }, {
          $sample: {
            size: parseInt(size)
          }
        }])
        console.log(quizs.length)
        if (quizs.length === 0) {
          return res.sendStatus(500)
        }
        quizs.forEach((quiz) => {
          idQuizs.push(quiz._id)
        })
      }

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
      let topicGameId = seasons.topicGame;
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

      seasonDBs.rooms.push(room._id);
      await seasonDBs.save()
      return res.send({
        quizset: set.toJSON(),
        roomPIN: room.roomPIN
      });
      // Room.save().then(function (obj) {
      //   console.log("New game pin:", obj.roomPIN);
      // });
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(500);
    }
  },

  async updateSeasonStatus(req, res) {
    try {
      if (req.body.status) {
        const trueSeason = await Season.find({
          'status': true
        })
        if (trueSeason.length > 0) {
          return res.send({
            message: 'have season is active'
          }).status(400)
        }
      }
      const season = await Season.findOne({
        '_id': req.query.seasonId
      })
      console.log(season)
      season.status = req.body.status
      await season.save()
      return res.send('change status success')
    } catch (error) {
      console.log(error)
      let err = new Err();
      err.content = error;
      err.save(err);
      res.sendStatus(400);
    }
  }
}