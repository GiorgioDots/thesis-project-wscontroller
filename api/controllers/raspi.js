const socketIO = require("../../services/socket.io");

module.exports.sendMessage = (req, res, next) => {
    const raspiId = req.params.raspiId;
    const message = req.body;
    console.log(message);

    if (!raspiId) {
        throw new Error("No raspiId sent");
    }
    if (!message) {
        throw new Error("No body found inside the request");
    }

    socketIO.sendPrivate(raspiId, "raspi-config", JSON.stringify(message))
        .then(isSent => {
            if (isSent) {
                res.status(200).json({ status: "RapiId updated" })
            }
            else {
                throw new Error(`An error occured while sending the configuration for raspberry: ${raspiId}`);
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
}