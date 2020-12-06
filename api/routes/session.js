let express = require('express');
let router = express.Router();
let mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);

const sessionController = require('../controller/session')
const seasonController = require('../controller/season')

let History = require('../models/models.js').History

// Create a new game session with quizsetID
// Required params
// quizsetID
//      type: ObjectID
router.post('/create-new-session', sessionController.createNewSession)

router.post('/add-player', sessionController.addPlayer)

// Remove a player from a game session according to the roomPIN and nickname
router.post('/remove-player', sessionController.removePlayer)

router.post('/save-history', (req, res) => {
    let history = new History({
        gamePIN: req.body.gamePIN,
        answerStatistics: req.body.stats
    })
    history.save()
})
// Remove a game session according to the roomPIN
router.post('/remove-session', sessionController.removeSession)

// Getting all game sessions
router.get('/sessions', sessionController.sessions)

// Validate game when join game
router.post('/validate-game', sessionController.validateGame)

// add topic game
router.post('/add-topic-game', sessionController.addGameTopic)

// get list game
router.get('/get-topic-game', sessionController.listGames)

// add new season
router.post('/add-season', seasonController.addnewSeason)

router.post('/update-season', seasonController.updateSeason)

router.post('/update-season-status', seasonController.updateSeasonStatus)

router.get('/get-season', seasonController.getSeasons)

router.post('/create-room-allow-season', seasonController.roomAllowSeason)



module.exports = router;