const Room = require('../../models/models.js').Room;
const Quizset = require('../../models/models.js').Quizset;
// const Quiz = require('../../models/models.js').Quiz;
const Question = require('../../models/models.js').Question;
const Answer = require('../../models/models.js').Answer;
const Game = require('../../models/models.js').Game;
const Err = require('../../models/models.js').Error;
const Season = require('../../models/models.js').Season;

let currentSessions = {}

module.exports = {
  quizGameSocket(socket, io) {
    console.log('New client connected');

    socket.on('get game list', async () => {
      try {
        let games = await Game.find({})
        for (let i = 0; i < games.length; i++) {
          games[i] = games[i].toJSON()
          const messages = await Room.count({ 'topicGame': games[i]._id })
          console.log(messages)
          games[i].roomCount = messages
          console.log(games[i]._id)
        }
        console.log(games)
        if (games) {
          io.sockets.emit('update game list', games);
        }
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    socket.on('get room list', async (topicGameId) => {

      // const filter = (topicGameId) ? { 'topicGame': topicGameId } : {}
      // const messages = await Room.find(filter, { '_id': '_id', 'roomPIN': 'roomPIN' });
      // console.log(messages)
      // if (messages) {
      //   io.sockets.emit('update room list', messages);
      // }
      try {
        const filter = (topicGameId) ? { 'topicGame': topicGameId } : {}
        const messages = await Room.find(filter, { '_id': '_id', 'roomPIN': 'roomPIN' });
        console.log(messages)
        if (messages) {
          io.sockets.emit('update room list', messages);
        }
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // broadcast the latest player list if someone requested
    socket.on('get player list', (roomPIN) => {
      try {
        const pinFilter = { roomPIN: roomPIN };
        Room.findOne(pinFilter, function (err, doc) {
          // console.log("FOUND DOC:", doc);
          if (err) {
          } else {
            if (doc) {
              io.sockets.emit('update player list' + roomPIN, doc.players);
            }
          }
        });
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // Enter game, send the quiz name
    socket.on('enter game', (roomPIN) => {
      try {
        currentSessions[roomPIN] = {}
        const pinFilter = { roomPIN: roomPIN };
        console.log(pinFilter)
        Room.findOne(pinFilter, function (err, game) {
          console.log("FOUND DOC:", game)
          if (err) {
          } else {
            Quizset.findById(game.quizset, function (err, quizset) {
              console.log(quizset);
              io.sockets.emit('enter game' + roomPIN, quizset.name);
            })
          }
        })
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // Start game, send the entire quiz

    socket.on('start game', async (roomPIN) => {
      try {
        currentSessions[roomPIN] = {}
        const pinFilter = { roomPIN: roomPIN };
        const room = await Room.findOne(pinFilter);
        console.log(room)
        const quizset = await Quizset.findById(room.quizset)

        let questions = await Question.find({
          '_id': { $in: quizset.quizset }
        })

        for (let i = 0; i < questions.length; i++) {
          questions[i] = questions[i].toJSON()
          let answer = await Answer.findOne({ 'questionId': questions[i]._id })
          console.log(answer)
          questions[i].option1 = answer.option1
          questions[i].option2 = answer.option2
          questions[i].option3 = answer.option3
          questions[i].option4 = answer.option4
          questions[i].answer = answer.answer
        }

        io.sockets.emit('start game' + roomPIN, questions);
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // show answer, send the answer statistic
    socket.on('show answer', (info) => {
      try {
        console.log('game ' + info.roomPIN + ', show answer for quiz ' + info.quizNo);
        io.sockets.emit('show answer' + info.roomPIN, info.answerStatistic);
        // TODO:
        // Upload previous stats to database
        currentSessions[info.roomPIN][info.quizNo] = info.answerStatistic
        console.log(currentSessions)
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // next quiz, send the quiz number
    socket.on('next quiz', (info) => {
      try {
        console.log('game ' + info.roomPIN + ', turn to quiz ' + info.quizNo);
        io.sockets.emit('next quiz' + info.roomPIN, info.quizNo);
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // show result
    socket.on('show result', (info) => {
      try {
        console.log('game ' + info.roomPIN);
        io.sockets.emit('show result' + info.roomPIN, currentSessions[info.roomPIN]);
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
      console.log('user disconnected')

    });

    // Collect answers from players
    // modified by Hoan
    // change to try catch
    // date: 2020/9/14
    socket.on('submit answer', (info) => {
      try {
        console.log(info)
        console.log('A user from game', info.roomPIN, 'has submitted a answer', info.choice)
        io.sockets.emit('notify host', {
          roomPIN: info.roomPIN,
          choice: info.choice
        });
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    })

    // Remove player from game session and notify host
    // modified by Hoan
    // change to try catch
    // date: 2020/9/14
    socket.on('player leave', async (info) => {

      const pinFilter = {
        roomPIN: info.roomPIN
      };
      const removeFilter = {
        nickname: info.nickname
      }

      try {
        await Room.update(pinFilter, {
          $pull: {
            players: removeFilter
          }
        });

        const doc = await Room.findOne(pinFilter);
        return io.sockets.emit('update player list' + info.roomPIN, doc.players);
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return
      }
    })

    // Notify players that a host has disconnected
    // modified by Hoan
    // change to try catch
    // date: 2020/9/14
    socket.on('host leave', (info) => {
      try {
        console.log("Host of", info.roomPIN, "has left. Disconnecting players...")
        axios.post(`${config.BE_Domain}/session/remove-session`, {
          roomPIN: info.roomPIN
        }).then(res => {
          console.log("emitting:", "host left" + info.roomPIN)
          io.sockets.emit("host left" + info.roomPIN)
        })
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    })

    socket.on('get room list allow season', async () => {

      // const filter = (topicGameId) ? { 'topicGame': topicGameId } : {}
      // const messages = await Room.find(filter, { '_id': '_id', 'roomPIN': 'roomPIN' });
      // console.log(messages)
      // if (messages) {
      //   io.sockets.emit('update room list', messages);
      // }
      try {

        let seasonsDB = await Season.findOne({ 'status': true })

        const messages = await Room.find({'_id': {$in: seasonsDB.rooms}}, { '_id': '_id', 'roomPIN': 'roomPIN' });
        console.log(messages)
        if (messages) {
          io.sockets.emit('update room list allow season', messages);
        }
      } catch (error) {
        let err = new Err();
        err.content = error;
        err.save(err);
        return;
      }
    });
  },
}