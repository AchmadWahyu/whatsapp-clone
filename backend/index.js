const { WebSocketServer } = require('ws');
const http = require('http');
const { randomUUID } = require('crypto');

const server = http.createServer();
const port = process.env.PORT || 8080

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const userId = randomUUID();

  wss.clients.forEach((client) => {
    if (client.OPEN) {
      client.send(
        JSON.stringify({
          id: userId,
          text: `User ${userId} joined the chat`,
          type: 'connection',
          timeStamp: Date.now()
        })
      );
    }
  });

  ws.on('error', console.error);

  ws.on('message', (data) => {
    const composedChat = {
      ...JSON.parse(data),
      timeStamp: Date.now()
    };

    wss.clients.forEach((client) => {
      if (client.OPEN) {
        client.send(JSON.stringify(composedChat));
      }
    });
  });
});

server.listen(port, () => {
  console.log('server listening!');
});
