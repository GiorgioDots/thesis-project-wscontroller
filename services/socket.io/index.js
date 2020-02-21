const socketIO = require('socket.io');
const _ = require('lodash');

module.exports = {
    client: null,
    connections: {},
    init: function (expressServer) {
        const io = socketIO(expressServer);
        const connections = {};
        this.connections = connections;
        this.client = io;

        io.on('connection', (socket) => {
            let clientStatus = {
                isConnected: false,
                id: null
            };
            console.info('WebSocket: client connected');

            socket.on('disconnect', socket => {
                console.info('WebSocket: client disconnected.');
                const disconnectedClientId = _.findKey(connections, socket.id);
                if (disconnectedClientId) {
                    delete connections[disconnectedClientId];
                    clientStatus = {
                        isConnected: false,
                        id: null
                    };
                }
            });

            socket.on('identification', msg => {
                try {
                    const jmsg = JSON.parse(msg);
                    if (jmsg.id) {
                        if (clientStatus.isConnected && clientStatus.id === jmsg.id) {
                            console.info(
                                `WebSocket: user already connected with same id [${
                                jmsg.id
                                }] on socket ${socket.id}.`
                            );
                        } else if (clientStatus.isConnected && clientStatus.id !== jmsg.id) {
                            console.info(
                                `WebSocket: user [${
                                jmsg.id
                                }] already connected with different id [${
                                clientStatus.id
                                }] on socket ${socket.id}.`
                            );
                        } else if (connections[jmsg.id]) {
                            console.info(
                                `WebSocket: user [${
                                jmsg.id
                                }] already connected on different socket: [${
                                connections[jmsg.id].id
                                }]. Message received on socket ${socket.id}.`
                            );
                        } else {
                            connections[jmsg.id] = socket;
                            clientStatus.isConnected = true;
                            clientStatus.id = jmsg.id;
                            console.info(
                                `New user successfully connected with id ${
                                jmsg.id
                                } on socket ${socket.id}.`
                            );
                        }
                    }
                } catch (error) {
                    console.error(`Malformed payload: failed to parseJSON ${msg}`);
                }
            });
        });
        return this.client
    },
    sendPrivate(id, chatRoom, message) {
        if (this.connections[id]) {
            //chatroom is a string needed to create an event. use this chatroom to identify raspberry and users (e.g.: 'raspi' or 'events');
            this.connections[id].emit(chatRoom, message);
            return Promise.resolve(true);
        }
        console.debug(`Private message sent to unknown user: ${id}`);
        return Promise.resolve(false);
    },
};