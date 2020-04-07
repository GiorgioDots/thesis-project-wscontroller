const socketIo = require("../../services/socket.io");
const logger = require("../../services/winston");

exports.sendEvent = async (req, res, next) => {
  const userId = req.body.userId;
  const event = req.body.event;
  if (!userId) {
    const error = new Error("UserId is required.");
    error.statusCode = 422;
    return next(error);
  }
  if (!event) {
    const error = new Error("Event is required.");
    error.statusCode = 422;
    return next(error);
  }
  try {
    logger.info(`Send event to ${userId} - Sending.`);
    socketIo.sendPrivate(userId, "event", JSON.stringify(event));
    logger.info(`Send event to ${userId} - Sent.`);
    res.status(200).json({ message: "Success." });
  } catch (error) {
    next(error);
  }
};

exports.sendLiveCameraImages = async (req, res, next) => {
  const images = req.body.images;
  const userId = req.body.userId;
  if (!userId) {
    const error = new Error("UserId is required.");
    error.statusCode = 422;
    return next(error);
  }
  if (!images) {
    const error = new Error("ImageUrl is required.");
    error.statusCode = 422;
    return next(error);
  }
  try {
    logger.info(`Send "live-stream-image" to ${userId} - Sending.`);
    socketIo.sendPrivate(userId, "live-stream-image", JSON.stringify(images));
    logger.info(`Send "live-stream-image" to ${userId} - Sent.`);
    res.status(200).json({ message: "Success." });
  } catch (err) {
    next(err);
  }
};
