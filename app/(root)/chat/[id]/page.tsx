import MessageList from '@/components/chat/MessageList';
import SendMessage from '@/components/chat/SendMessage';
import FriendsList from '@/components/chat/FriendsList';

export default function ChatApp() {
  return (
    <div>
      <h1>Chat</h1>
      <FriendsList />
      <SendMessage />
      <MessageList />
    </div>
  );
}
