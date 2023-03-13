const express = require('express');
const router = express.Router();

const BuzzerController = require('../Controllers/Buzzer.controller');

router.get('/', BuzzerController.create);

module.exports = router;