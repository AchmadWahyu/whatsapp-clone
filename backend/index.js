const { WebSocketServer } = require('ws');
const http = require('http');
const { randomUUID } = require('crypto');

const server = http.createServer();
const port = 8080;

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  ws.on('open', function open() {
    ws.send('server: 2');
  });

  ws.on('error', console.error);

  ws.on('message', (data) => {
    const composedChat = {
      id: randomUUID(),
      text: data.toString(),
    };
    
    ws.send(JSON.stringify(composedChat));
  });
  
});

server.listen(port, () => {
  console.log('server listening!');
});
