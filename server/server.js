import http from 'http';
import express from 'express';
import io from 'socket.io';
import bodyparser from 'body-parser';
import chatbot from './chatterbot/chatbotController.js';
import analyzerController from './controllers/analyzerController.js';

const routes = require('./config/routes.js');

const app = express();
const theServer = http.Server(app);
const ioServer = io(theServer);

const port = process.env.PORT || 1337;
app.use(express.static(`${__dirname}/../client`));
app.use(bodyparser);
routes(app);


ioServer.on('connection', (socket) => {
  console.log('a user connected: ', socket.conn.id);

  socket.on('message', (msg) => {
    console.log('client - ', msg);
    analyzerController.setAnalysis(msg);
    chatbot.response(msg, (err, response) => {
      if (err) { console.log(err); }
      console.log('bot says - ', response);
      socket.emit('message', response);
    });
  });

  socket.on('emotions', () => {
    analyzerController.getAnalysis((err, response) => {
      if (err) { console.log(err); }
      socket.emit('emotions', response);
    });
  });

  socket.on('disconnect', () => { console.log('user disconnected'); });
});

theServer.listen(port, () => {
  console.log('listening on localhost:', port);
});
