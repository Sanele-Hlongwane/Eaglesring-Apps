import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

// Define your getStreamClient function
const getStreamClient = () => {
  return StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY as string);
};

// Define API route handlers
export async function GET() {
  try {
    const client = getStreamClient();
    // Example usage of the client, like fetching channels or users
    // const channels = await client.queryChannels();
    
    return NextResponse.json({ message: 'Stream client initialized successfully' });
  } catch (error) {
    console.error('Error initializing Stream client:', error);
    return NextResponse.json({ error: 'Failed to initialize Stream client' }, { status: 500 });
  }
}
