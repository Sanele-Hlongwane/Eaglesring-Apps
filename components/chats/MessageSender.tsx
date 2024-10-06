"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// Define the props type for the component
interface MessageSenderProps {
  userId: number; // or string, depending on your ID type
}

const MessageSender: React.FC<MessageSenderProps> = ({ userId }) => {
  const [receiverId, setReceiverId] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");

  const sendMessage = async () => {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId, content: messageContent }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Message sent successfully");
        setReceiverId("");
        setMessageContent("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Send Message</h2>
      <input
        type="text"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Enter Receiver ID"
        className="border rounded p-2 mb-4 w-full"
      />
      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        placeholder="Enter your message"
        className="border rounded p-2 mb-4 w-full"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
        Send Message
      </button>
    </div>
  );
};

export default MessageSender;
