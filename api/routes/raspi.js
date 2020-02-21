const express = require('express');
const raspiController = require('../controllers/raspi');
const router = express.Router();

router.post('/:raspiId', raspiController.sendMessage);

module.exports = router;