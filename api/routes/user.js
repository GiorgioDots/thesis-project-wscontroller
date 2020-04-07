const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/event", userController.sendEvent);

router.post("/live-camera", userController.sendLiveCameraImages);

module.exports = router;
