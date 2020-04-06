const socketIO = require("../../services/socket.io");
const logger = require("../../services/winston");

exports.restartRaspberry = async (req, res, next) => {
  const raspiId = req.params.raspiId;
  if (!raspiId) {
    const error = new Error("RaspiId is required.");
    error.statusCode = 422;
    return next(error);
  }
  try {
    logger.info(`Restarting raspberry ${raspiId} - Sending.`);
    const isSent = await socketIO.sendPrivate(raspiId, "restart");
    if (isSent) {
      logger.info(`Restarting raspberry ${raspiId} - Restarted.`);
      res.status(200).json({ message: "Raspberry updated." });
    } else {
      logger.info(`Restarting raspberry ${raspiId} - Raspberry not connected.`);
      const error = new Error(
        `Could not connect to raspberry: ${raspiId}, please check if it's connected to the internet.`
      );
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    return next(err);
  }
};

exports.restartRaspberries = async (req, res, next) => {
  const raspiIds = req.body.raspiIds;
  const raspNotConnected = [];
  try {
    for (raspiId of raspiIds) {
      logger.info(`Restarting raspberry ${raspiId} - Sending.`);
      const isSent = await socketIO.sendPrivate(raspiId, "restart");
      if (isSent) {
        logger.info(`Restarting raspberry ${raspiId} - Restarted.`);
      } else {
        logger.info(
          `Restarting raspberry ${raspiId} - Raspberry not connected.`
        );
        raspNotConnected.push(raspiId);
      }
    }
    if (raspNotConnected.length > 0) {
      const error = new Error(
        `could not connect to raspberries: ${raspNotConnected.join()}, please check if it's connected to the internet.`
      );
      error.statusCode = 404;
      error.data = raspNotConnected;
      throw error;
    }
    res.status(200).json({ message: "Raspberries updated." });
  } catch (err) {
    return next(err);
  }
};
