const socketIO = require("socket.io");
const _ = require("lodash");

const logger = require("../winston");

module.exports = {
  client: null,
  connections: {},
  init: function (expressServer) {
    const io = socketIO(expressServer);
    const connections = {};
    this.connections = connections;
    this.client = io;

    io.on("connection", (socket) => {
      let clientStatus = {
        isConnected: false,
        id: null,
        socketId: null,
      };
      logger.info("WebSocket: client connected");

      socket.on("disconnect", (socket) => {
        logger.info("WebSocket: client disconnected.");
        const disconnectedClientId = _.findKey(connections, socket.id);
        if (disconnectedClientId) {
          connections[disconnectedClientId] = connections[
            disconnectedClientId
          ].filter((s) => s.id !== clientStatus.socketId);
          clientStatus = {
            isConnected: false,
            id: null,
            socketId: null,
          };
          if (connections[disconnectedClientId].length === 0) {
            delete connections[disconnectedClientId];
          }
        }
      });

      socket.on("identification", (msg) => {
        try {
          const jmsg = JSON.parse(msg);
          if (jmsg.id) {
            if (connections[jmsg.id]) {
              connections[jmsg.id].push(socket);
            } else {
              connections[jmsg.id] = [socket];
            }
            clientStatus.isConnected = true;
            clientStatus.id = jmsg.id;
            clientStatus.socketId = socket.id;
            console.log(connections);
            logger.info(
              `WebSocket: New user successfully connected with id ${jmsg.id} on socket ${socket.id}.`
            );
          }
        } catch (error) {
          logger.error(`Malformed payload: failed to parseJSON ${msg}`);
        }
      });
    });
    return this.client;
  },
  sendPrivate(id, chatRoom, message) {
    if (this.connections[id]) {
      //chatroom is a string needed to create an event. use this chatroom to identify raspberry and users (e.g.: 'raspi' or 'events');
      for (let conn of this.connections[id]) {
        console.log(conn);
        conn.emit(chatRoom, message);
      }
      return Promise.resolve(true);
    }
    logger.info(`Private message sent to unknown user: ${id}`);
    return Promise.resolve(false);
  },
};
