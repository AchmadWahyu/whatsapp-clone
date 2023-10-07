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
    // workaround because eventListener cant access the latest value of the state
    // this is happen because eventListener is set on to run only on first render
    // src: https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
    
    const newChats = [...chatsRef.current, val];

    _setChats(newChats);
    chatsRef.current = newChats;
  };

  const [chatSocket, setChatSocket] = useState<WebSocket | null>();
  useEffect(() => {
    function connectToWebSocket() {
      const socket = new WebSocket('ws://localhost:8080');

      socket.addEventListener('open', () => {
        socket.send('client: connected!');
      });

      socket.addEventListener('message', (event) => {
        setChats(JSON.parse(event.data));
      });

      return socket;
    }

    setChatSocket(connectToWebSocket());
  }, []);

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
      <div>
        {chats.map((chat) => (
          <div key={chat?.id}>{chat?.text}</div>
        ))}
      </div>
    </main>
  );
}
