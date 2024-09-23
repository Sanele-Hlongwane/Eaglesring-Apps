import { StreamChat } from "stream-chat";

export const getStreamClient = () => {
  const client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
  );
  return client;
};
