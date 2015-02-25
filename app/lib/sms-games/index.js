var express = require('express')
  , router = express.Router();

var SGCreateFromMobileController = require('./controllers/SGCreateFromMobileController')
  , SGCollaborativeStoryController = require('./controllers/SGCollaborativeStoryController')
  , SGCompetitiveStoryController = require('./controllers/SGCompetitiveStoryController')
  , SGMostLikelyToController = require('./controllers/SGMostLikelyToController')
  , SGSoloController = require('./controllers/SGSoloController')
  ;

/**
 * Guides users through creating an SMS multiplayer game from mobile.
 * Creates a game by re-POSTing to the /create route below. 
 */
router.post('/mobile-create', function(request, response) {
  var host = request.get('host'); // Retrieving hostname; Express parsing request.
  var controller = new SGCreateFromMobileController(host);
  controller.processRequest(request, response);
});

/**
 * Creates a new one-player solo SMS game. 
 * Also creates a game by re-POSTing to the 
 * /create route below. 
 */
router.post('/solo', function(request, response) {
  var host = request.get('host');
  var controller = new SGSoloController(host);
  controller.processRequest(request, response);
});

/**
 * Gets a game controller.
 *
 * @param request Express request object
 *
 * @return Instance of the appropriate game controller for the game type
 */
function getGameController(request) {
  // Game type could be in either GET or POST param.
  var gameType = '';
  if (typeof request.query.story_type !== 'undefined') {
    gameType = request.query.story_type;
  }
  else if (typeof request.body.story_type !== 'undefined') {
    gameType = request.body.story_type;
  }

  if (gameType === 'collaborative-story') {
    return new SGCollaborativeStoryController;
  }
  else if (gameType === 'competitive-story') {
    return new SGCompetitiveStoryController;
  }
  else if (gameType === 'most-likely-to') {
    return new SGMostLikelyToController;
  }

  return null;
}

/**
 * Create a team SMS game.
 */
router.post('/create', function(request, response) {
  var gameController = getGameController(request);
  if (gameController == null) {
    response.status(406).send('Invalid `type` parameter.');
  }
  else {
    gameController.createGame(request, response);
  }
});

/**
 * Beta accepts the invite to a game request.
 */
router.post('/beta-join', function(request, response) {
  var gameController = getGameController(request);
  if (gameController == null) {
    response.status(406).send('Invalid `type` parameter.');
  }
  else {
    gameController.betaJoinGame(request, response);
  }
});

/**
 * Alpha manually chooses to start a game.
 */
router.post('/alpha-start', function(request, response) {
  var gameController = getGameController(request);
  if (gameController == null) {
    response.status(406).send('Invalid `type` parameter.');
  }
  else {
    gameController.alphaStartGame(request, response);
  }
});

/**
 * A user in a game texts back an action.
 */
router.post('/user-action', function(request, response) {
  var gameController = getGameController(request);
  if (gameController == null) {
    response.status(406).send('Invalid `type` parameter.');
  }
  else {
    gameController.userAction(request, response);
  }
});

module.exports = router;