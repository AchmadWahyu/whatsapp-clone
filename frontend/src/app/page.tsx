'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

type Chat = {
  id: string;
  text: string;
  type: string;
  timeStamp: number;
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

  const [userId, _setUserId] = useState(null);
  const userIdRef = useRef<string>('');

  const [chatSocket, setChatSocket] = useState<WebSocket | null>();
  useEffect(() => {
    function connectToWebSocket() {
      const socket = new WebSocket('ws://localhost:8080');

      socket.addEventListener('message', (event) => {
        const { type, id } = JSON.parse(event.data);

        switch (type) {
          case 'connection':
            if (!userIdRef.current) {
              _setUserId(id);
              userIdRef.current = id;
            }

            setChats({
              ...JSON.parse(event.data),
              id: userId,
            });

            break;
          case 'chat':
            setChats(JSON.parse(event.data));
            break;
        }
      });

      return socket;
    }

    setChatSocket(connectToWebSocket());
  }, []);

  function composeChatTimeStamp(time: number) {
    const date = new Date(time);

    return `(${date.getHours()}:${date.getMinutes()})`;
  }

  function composeChat(chat: Chat) {
    const { type, timeStamp } = chat;

    switch (type) {
      case 'connection':
        return `${composeChatTimeStamp(timeStamp)} ${chat?.text}`;
      case 'chat':
        return `${chat?.id?.slice(0, 8)} ${composeChatTimeStamp(timeStamp)} : ${
          chat?.text
        }`;
    }
  }

  return (
    <main className={styles.main}>
      <form
        onSubmit={(e) => {
          e?.preventDefault();
          chatSocket?.send(
            JSON.stringify({
              id: userId,
              text,
              type: 'chat',
            })
          );
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
          <div key={chat?.id}>{composeChat(chat)}</div>
        ))}
      </div>
    </main>
  );
}
