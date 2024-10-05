"use client";

import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaCheck, FaCheckDouble, FaPlus } from "react-icons/fa";

type Message = {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  status: "SENT" | "RECEIVED" | "READ";
  sentAt: string;
  readAt: string | null;
};

type Conversation = {
  id: number;
  name: string;
  messages: Message[];
};

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageStatus: "SENT" | "RECEIVED" | "READ";
};

type Friend = {
  id: number;
  name: string;
};

const MessagesPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChatList, setShowNewChatList] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetchChats();
    fetchConversations();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  const fetchChats = async () => {
    try {
      const chatResponse = await fetch("/api/messages/chats");
      if (!chatResponse.ok) throw new Error("Failed to fetch chats");
      const chatData = await chatResponse.json();
      setChats(chatData);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const conversationResponse = await fetch("/api/messages/conversation"); // Make sure your API endpoint is correct
      if (!conversationResponse.ok) throw new Error("Failed to fetch conversations");
      const conversationData = await conversationResponse.json();
      setConversations(conversationData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/opportunities/accepted");
      if (!response.ok) throw new Error("Failed to fetch friends");
      const friendsData = await response.json();
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/messages/conversation/${conversationId}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error("Failed to fetch messages");
      }

      const messagesData = await response.json();
      setActiveChat((prevChat) =>
        prevChat ? { ...prevChat, messages: messagesData } : null
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !activeChat) return;

    const messageData = {
      receiverId: activeChat.id,
      content: newMessage,
    };

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation.id === activeChat.id) {
              return {
                ...conversation,
                messages: [...conversation.messages, sentMessage],
              };
            }
            return conversation;
          })
        );
        setNewMessage(""); // Clear the message input
      } else {
        console.error("Error sending message:", await response.json());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatClick = (chat: Chat) => {
    // Find the conversation in the state
    const conversation = conversations.find(conv => conv.id === chat.id);
    if (conversation) {
      setActiveChat(conversation); // Set the active chat to the found conversation
    }
  };

  const handleNewChatClick = (friend: Friend) => {
    setActiveChat({
      id: friend.id,
      name: friend.name,
      messages: [],
    });
    setShowNewChatList(false);
    fetchChats();
    fetchConversations();
  };

  return (
    <div className="relative flex flex-col md:flex-row h-screen">
      {/* Chat List */}
      <div className={`w-full md:w-1/3 bg-gray-100 p-4 border-r border-gray-300 ${activeChat ? "hidden md:block" : "block"}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <button
            className="hidden md:block p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            onClick={() => setShowNewChatList(!showNewChatList)}
          >
            <FaPlus />
          </button>
        </div>
        {!showNewChatList ? (
          <ul>
            {chats.map((chat) => (
              <li
                key={chat.id}
                onClick={() => handleChatClick(chat)} // Call handleChatClick with the clicked chat
                className="p-4 mb-2 bg-white rounded-lg shadow hover:bg-gray-200 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{chat.name}</div>
                  <div className="text-sm text-gray-600">{chat.lastMessage}</div>
                  <div className="text-xs text-gray-400">{chat.lastMessageTime}</div>
                </div>
                <div className="text-gray-500">
                  {chat.lastMessageStatus === "SENT" && <FaCheck />}
                  {chat.lastMessageStatus === "RECEIVED" && <FaCheckDouble />}
                  {chat.lastMessageStatus === "READ" && <FaCheckDouble className="text-blue-500" />}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => handleNewChatClick(friend)}
                className="p-4 mb-2 bg-white rounded-lg shadow hover:bg-gray-200 cursor-pointer"
              >
                {friend.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Messages */}
      <div className={`w-full md:w-2/3 flex flex-col ${activeChat ? "block" : "hidden md:block"}`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-gray-200 border-b border-gray-300 flex items-center">
              <button
                className="text-sm md:hidden mr-4 text-blue-500"
                onClick={() => setActiveChat(null)}
              >
                Back
              </button>
              <img
                src="https://via.placeholder.com/40"
                alt={activeChat.name}
                className="rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{activeChat.name}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col">
                {activeChat.messages && activeChat.messages.map((message) => (
                  <div key={message.id} className={`my-2 p-2 rounded-lg ${message.senderId === activeChat.id ? "bg-blue-200 self-end" : "bg-gray-200 self-start"}`}>
                    {message.content}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex p-4 bg-gray-100 border-t border-gray-300">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
