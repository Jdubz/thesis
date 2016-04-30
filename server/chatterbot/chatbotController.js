const PyShell = require('python-shell');
const dgram = require('dgram');
const router = require('./botRouter.js');

const options = {
  mode: 'text',
  args: ['test'],
};

const LOCALHOST = '127.0.0.1';
const NODE_PORT = 41234;

const callbacks = {};
let callcount = 0;

// create UDP socket for conversing with bot
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg /* rinfo*/) => {
  const myMsg = JSON.parse(msg);
  myMsg.message = myMsg.message.replace('\n', '');
  callbacks[myMsg.id](myMsg.message);
  delete callbacks[myMsg.id];
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(NODE_PORT, LOCALHOST);

// create std in/out listeners for error handling
const pyProcess = new PyShell('./chatterbot.py', options);

pyProcess.on('message', message => {
  console.log(message);
});

pyProcess.on('close', err => {
  if (err) { console.log('python error ', err); }
  else { console.log('python finished'); }
});

pyProcess.on('error', err => {
  if (err) { console.log('python error ', err); }
});

module.exports = {
  response: (id, message, callback) => {
    callcount = ++callcount % 10000;
    const Uid = id + callcount.toString();
    callbacks[Uid] = callback;
    const toSend = { id: Uid, message: message };
    server.send(JSON.stringify(toSend), 51234, 'localhost', (err) => {
      if (err) { console.log(err); }
    });
  },
  train: conversation => {
    conversation.unshift('xxstartxx');
    conversation.push('xxendxx');
    for (var i in conversation) {
      pyProcess.send(conversation[i]);
    }
  },
  init: () => pyProcess.send('xxtrainxx'),
};
