"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Message {
  id: number;
  content: string;
  createdAt: string;
}

const Chat = ({ otherUserId }: { otherUserId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?otherUserId=${otherUserId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      toast.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, [otherUserId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage, receiverId: otherUserId }),
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p>{msg.content}</p>
            <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
