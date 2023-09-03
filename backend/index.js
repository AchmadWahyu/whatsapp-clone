const { WebSocketServer } = require('ws');
const port = 8080;

const wss = new WebSocketServer({ port });

wss.on('connection', (ws) => {
  console.log("connected!")  
    
  ws.on('error', console.error);

  ws.on('message', (data) => {
    console.log('received: %s', data);
  });

  ws.send('send something');
});
