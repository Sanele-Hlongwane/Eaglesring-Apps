"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  lastMessage: string;
}

const Sidebar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations');
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="w-64 h-full bg-gray-100 p-4 border-r">
      <h2 className="text-lg font-bold mb-4">Conversations</h2>
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/chat/${conversation.otherUserId}`}
          className="block mb-4 p-2 bg-white rounded-lg shadow-md"
        >
          <div>
            <strong>{conversation.otherUserName}</strong>
            <p className="text-gray-500">{conversation.lastMessage}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
