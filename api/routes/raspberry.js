const express = require("express");

const raspberryController = require("../controllers/raspberry");

const router = express.Router();

router.post(
  "/restart",
  raspberryController.restartRaspberries
);
router.post("/restart/:raspiId", raspberryController.restartRaspberry);

module.exports = router;
