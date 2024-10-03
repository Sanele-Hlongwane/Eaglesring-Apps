"use client";

import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

// Assuming these methods should exist on Call
interface ExtendedCall extends Call {
  setPreferredIncomingVideoResolution?: (resolution: number) => void;
  setIncomingVideoEnabled?: (enabled: boolean) => void;
}

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<ExtendedCall | null>(null); // Use the extended type
  const [isCallLoading, setIsCallLoading] = useState(true);
  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        const { calls } = await client.queryCalls({ filter_conditions: { id } });

        if (calls.length > 0) {
          setCall(calls[0] as ExtendedCall); // Assert the type here
        }

        setIsCallLoading(false);
      } catch (error) {
        console.error(error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);

  return { call, isCallLoading };
};
