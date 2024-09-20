"use client";

import { useEffect, useState } from 'react';

function MessageList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/messages/receive")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p><strong>From:</strong> {message.senderId}</p>
          <p>{message.content}</p>
          <p><small>Sent: {new Date(message.sentAt).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
