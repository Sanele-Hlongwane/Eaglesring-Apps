"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

interface Message {
  id: number;
  content: string;
  createdAt: string;
}

const ChatWindow = ({ otherUserId }: { otherUserId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?otherUserId=${otherUserId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, receiverId: otherUserId }),
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <p>{msg.content}</p>
              <small className="text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-grow p-2 border border-gray-300 rounded-l-lg"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
