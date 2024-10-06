"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { FaPaperPlane, FaCheck, FaCheckDouble, FaPlus } from "react-icons/fa";

// Define Message Type
type Message = {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  status: "SENT" | "RECEIVED" | "READ";
  sentAt: string;
  readAt: string | null;
};

// Define Conversation Type
type Conversation = {
  id: number;
  messages: Message[];
  latestMessage: Message | null;
  participants: { id: number; name: string }[];
};

// Define Chat Type
type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageStatus: "SENT" | "RECEIVED" | "READ";
};

// Define Friend Type
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
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchChatsAndConversations();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id);
    }
  }, [activeChat]);

  const fetchChatsAndConversations = async () => {
    try {
      const response = await fetch("/api/messages/chats");
      if (!response.ok) throw new Error("Failed to fetch chats");
      const chatData = await response.json();
      
      const chatList: Chat[] = chatData.conversations.map((conversation: Conversation) => ({
        id: conversation.id,
        name: conversation.participants.map(p => p.name).join(", "),
        lastMessage: conversation.latestMessage ? conversation.latestMessage.content : "",
        lastMessageTime: formatMessageTime(conversation.latestMessage?.sentAt || ""),
        lastMessageStatus: conversation.latestMessage ? conversation.latestMessage.status : "SENT",
      }));

      setChats(chatList);
      setConversations(chatData.conversations);
    } catch (error) {
      console.error("Error fetching chats and conversations:", error);
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

  const fetchMessages = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/conversation/${id}`, {
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const messagesData: Message[] = await response.json();
      setActiveChat((prevChat) =>
        prevChat ? { ...prevChat, messages: messagesData } : null
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const formatMessageTime = (time: string) => {
    const now = new Date();
    const messageDate = new Date(time);
    const difference = now.getTime() - messageDate.getTime();
    
    if (difference < 86400000) { // less than 24 hours
      const hours = messageDate.getHours().toString().padStart(2, "0");
      const minutes = messageDate.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    
    return messageDate.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage || !activeChat) return;

    const messageData = {
      receiverId: activeChat.participants[0].id,
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
                latestMessage: sentMessage,
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
    const conversation = conversations.find(conv => conv.id === chat.id);
    if (conversation) {
      setActiveChat(conversation);
    }
  };

  const handleNewChatClick = (friend: Friend) => {
    setActiveChat({
      id: friend.id,
      participants: [{ id: friend.id, name: friend.name }],
      messages: [],
      latestMessage: null,
    });
    setShowNewChatList(false);
  };
  
  return (
    <div className="">
      <Navbar />
      <div className="relative flex flex-col md:flex-row h-screen dark:bg-gray-900">
        {/* Chat List */}
        <div className={`w-full md:w-1/3 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 ${activeChat ? "hidden md:block" : "block"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-gray-200">Chats</h2>
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
      <li key={chat.id} className="mb-2">
        <button
          type="button" // Specify the button type
          onClick={() => handleChatClick(chat)}
          className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold dark:text-gray-300">{chat.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{chat.lastMessage}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{chat.lastMessageTime}</div>
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {chat.lastMessageStatus === "SENT" && <FaCheck />}
              {chat.lastMessageStatus === "RECEIVED" && <FaCheckDouble />}
              {chat.lastMessageStatus === "READ" && <FaCheckDouble className="text-blue-500" />}
            </div>
          </div>
        </button>
      </li>
    ))}
  </ul>
) : (
  <ul>
    {friends.map((friend) => (
      <li key={friend.id} className="mb-2">
        <button
          type="button" // Specify the button type
          onClick={() => handleNewChatClick(friend)}
          className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
        >
          {friend.name}
        </button>
      </li>
    ))}
  </ul>
)}

      </div>

      {/* Chat Messages */}
      <div className={`w-full md:w-2/3 flex flex-col ${activeChat ? "block" : "hidden md:block"}`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center">
              <button
                className="text-sm md:hidden mr-4 text-blue-500"
                onClick={() => setActiveChat(null)}
              >
                Back
              </button>
              <img
                src="https://via.placeholder.com/40"
                alt={activeChat.participants[0].name}
                className="rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold dark:text-gray-300">{activeChat.participants.map(p => p.name).join(", ")}</h2>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeChat?.messages?.map((message) => (

                <div
                  key={message.id}
                  className={`flex items-end mb-4 ${
                    message.senderId === activeChat.participants[0].id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`max-w-xs rounded-lg p-4 shadow ${message.senderId === activeChat.participants[0].id ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-200"}`}>
                    {message.content}
                    <div className="flex items-center text-xs mt-2">
                      <span>{formatMessageTime(message.sentAt)}</span>
                      {message.status === "SENT" && <FaCheck className="ml-2" />}
                      {message.status === "RECEIVED" && <FaCheckDouble className="ml-2" />}
                      {message.status === "READ" && <FaCheckDouble className="ml-2 text-blue-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center">
              <input
                type="text"
                placeholder="Type your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-400 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              />
              <button onClick={handleSendMessage} className="p-2 ml-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Select a chat to start messaging</h2>
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={() => setShowNewChatList(true)}
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default MessagesPage;