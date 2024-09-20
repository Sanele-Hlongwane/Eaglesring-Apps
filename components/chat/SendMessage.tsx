"use client";

import { useState } from 'react';

function SendMessage() {
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");

  const sendMessage = async () => {
    await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ receiverId, content }),
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <textarea
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default SendMessage;
