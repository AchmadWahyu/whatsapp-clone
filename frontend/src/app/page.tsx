'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

type Chat = {
  id: string;
  text: string;
};

export default function Home() {
  const [text, setText] = useState('');
  const [chats, _setChats] = useState<Chat[]>([]);
  const chatsRef = useRef<Chat[]>(chats);

  const setChats = (val: Chat) => {
    const newChats = [...chatsRef.current, val];

    console.log('newChats: ', newChats);

    _setChats(newChats);
    chatsRef.current = newChats;
  };

  const [chatSocket, setChatSocket] = useState<WebSocket | null>();
  useEffect(() => {
    function connectToWebSocket() {
      const socket = new WebSocket('ws://localhost:8080');

      socket.addEventListener('open', () => {
        console.log('A socket.readyState: ', socket.readyState);
        socket.send('client: 1');
      });

      socket.addEventListener('message', (event) => {
        console.log('1 chatsRef?.current: ', chatsRef?.current);
        console.log('1 JSON.parse(event.data): ', JSON.parse(event.data));

        setChats(JSON.parse(event.data));
      });

      document.getElementById('test-button')?.addEventListener('click', () => {
        console.log(`clicked! chats: ${chats}`);
      });

      return socket;
    }

    setChatSocket(connectToWebSocket());
  }, []);

  console.log('2 chats: ', chats);

  return (
    <main className={styles.main}>
      <form
        onSubmit={(e) => {
          e?.preventDefault();
          chatSocket?.send(text);
        }}
      >
        <input
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          placeholder="input your message here"
        />
        <button type="submit">Send</button>
      </form>
      <div id="chat-container">
        {chats.map((chat) => (
          <div key={chat?.id}>{chat?.text}</div>
        ))}
      </div>
    </main>
  );
}
