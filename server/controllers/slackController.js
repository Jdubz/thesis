const chatbot = require('../chatterbot/chatbotController.js');
const AlchemyAPI = require('alchemy-api');

module.exports = {
  postMessage: (req, res, next) => {
    AlchemyAPI.sentiment(req.body, {}, (err, results) => {
      if (err) { console.log(err); }
      // store results in db
    });
    chatbot.response(req.body, (msg) => {
      res.send(msg);
    });
  },
};
