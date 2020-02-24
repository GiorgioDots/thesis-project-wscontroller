require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const raspiRoutes = require('./api/routes/raspi');
const socketIO = require('./services/socket.io/index');
const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(bodyParser.json());
app.use('/raspi', raspiRoutes);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});




const server = http.createServer(app);

socketIO.init(server);

const port = process.env.PORT || 8081;

setImmediate(() => {
    server.listen(port, () => {
        console.info(`Express server listening on port ${port}`);
    });
});