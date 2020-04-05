const express = require("express");
const raspberryController = require("../controllers/raspberry");
const router = express.Router();

router.post("/:raspiId/restart", raspberryController.restartRaspberry);

module.exports = router;
