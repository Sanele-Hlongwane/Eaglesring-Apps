// pages/api/conversations.ts

export default async function handler(req, res) {
    const mockConversations = [
      { id: 1, otherUserId: 2, otherUserName: 'John Doe', lastMessage: 'See you soon!' },
      { id: 2, otherUserId: 3, otherUserName: 'Jane Smith', lastMessage: 'How are you?' },
    ];
  
    res.status(200).json(mockConversations);
  }
  
  // pages/api/messages.ts
  
  export default async function handler(req, res) {
    const { otherUserId } = req.query;
  
    const mockMessages = [
      { id: 1, content: 'Hey there!', createdAt: '2023-09-01T12:00:00Z' },
      { id: 2, content: 'How are you?', createdAt: '2023-09-01T12:01:00Z' },
    ];
  
    res.status(200).json(mockMessages);
  }
  