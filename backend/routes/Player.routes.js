const express = require('express');
const router = express.Router();

const PlayerController = require('../Controllers/Player.controller');

router.post('/:id', PlayerController.createPlayer);
router.get('/:id', PlayerController.getPlayers);
router.delete('/:id/:name', PlayerController.deleteOnePlayer);

router.post('/:id/buzz', PlayerController.buzzPlayer);
router.delete('/:id/buzz', PlayerController.resetAllBuzzed);
router.delete('/:id/buzz/:name', PlayerController.resetOneBuzzed);


router.post('/:id/lock', PlayerController.lockAllPlayer);
router.post('/:id/lock/:name', PlayerController.lockOnePlayer);

router.post('/:id/score', PlayerController.score);
module.exports = router;

