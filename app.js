require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const logger = require("./services/winston");
const socketIO = require("./services/socket.io");
const raspberryRoutes = require("./api/routes/raspberry");
const userRoutes = require("./api/routes/user");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.json());

app.use("/raspberry", raspberryRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  logger.error(error.message);
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

const port = process.env.PORT || 8081;

const server = app.listen(port);
logger.info(`Express server listening on port ${port}`);
socketIO.init(server);
