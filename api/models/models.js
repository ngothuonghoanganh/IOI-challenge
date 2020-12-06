let mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose); // npm install --save mongoose-sequence

const SessionSchema = mongoose.Schema({
  roomPIN: {
    type: String,
    required: true
  },
  players: {
    type: [String],
    required: true
  }
})

const GameSchema = new mongoose.Schema({
  name: String,
  description: String
})

// User model
let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    index: true
  },
  password: {
    type: String,
    required: [true, "can't be blank"]
  },
  //  image:{type: [PictureSchema]},
  //  bio:[String],
  email: {
    type: String,
    lowercase: true,
    index: true
  },
  update: {
    type: Date,
    default: Date.now
  }
});

// Player model supports to store guest and user
let PlayerSchema = new mongoose.Schema({
  userid: String,
  nickname: String,
  update: {
    type: Date,
    default: Date.now
  }
});

// Quizset model
let QuizsetSchema = new mongoose.Schema({
  quizsetID: Number,
  name: String,
  tag: [String],
  quizset: [mongoose.Types.ObjectId],
  update: {
    type: Date,
    default: Date.now
  },
})

// Created by Hoan
// Error model 
let ErrorSchema = new mongoose.Schema({
  content: {
    type: String,
    lowercase: true,
    index: true
  },
  time: {
    type: Date,
    default: Date.now
  }
});

// Game model 
let RoomScheme = new mongoose.Schema({
  // unique PIN for each game
  roomPIN: Number,
  topicGame: [mongoose.Types.ObjectId],
  // quizset id
  quizset: [mongoose.Types.ObjectId],
  // an array of player
  players: [PlayerSchema],
  update: {
    type: Date,
    default: Date.now
  }
});
RoomScheme.plugin(AutoIncrement, {
  id: 'roomPIN_seq',
  inc_field: 'roomPIN'
});

let SessionHistorySchema = new mongoose.Schema({
  roomPIN: Number,
  answerStatistics: Object
});

const QuestionSchema = new mongoose.Schema({
  content: String,
  topic: String,
  user: mongoose.Types.ObjectId,
  status: Boolean,
  time: {
    type: Number,
    default: 0
  },
})

const AnswerSetShema = new mongoose.Schema({
  questionId: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answer: String
})

const SeasonSchema = new mongoose.Schema({
  content: String,
  status: Boolean,
  topicGame: [{
    topic: mongoose.Types.ObjectId,
    size: Number
  }],
  rooms: [mongoose.Types.ObjectId],
  status: Boolean
})


// mongoose.model('Picture', PictureSchema);
const Answer = mongoose.model("Answer", AnswerSetShema)
const Game = mongoose.model('Game', GameSchema)
const Question = mongoose.model("Question", QuestionSchema)
const Room = mongoose.model('Room', RoomScheme);
const Season = mongoose.model('Season', SeasonSchema)
let Error = mongoose.model('Error', ErrorSchema);
let History = mongoose.model('History', SessionHistorySchema);
let Player = mongoose.model('Player', PlayerSchema);
let Quizset = mongoose.model('Quizset', QuizsetSchema);
let Session = mongoose.model("Sessions", SessionSchema)
let User = mongoose.model('User', UserSchema);

// var Picture = mongoose.model('Picture', PictureSchema);
module.exports = {
  Answer,
  Error,
  Game,
  History,
  Player,
  Question,
  Quizset,
  Room,
  Session,
  Season,
  User
}