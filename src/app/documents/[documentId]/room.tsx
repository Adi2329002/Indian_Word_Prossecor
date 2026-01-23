"use client";

import { ReactNode } from "react";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { LiveblocksProvider } from "@liveblocks/react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function Room({ children, roomId }: { children: ReactNode; roomId: string }) {
  const fetchAuth = useAction(api.liveblocks.auth);

  return (
    <LiveblocksProvider 
      authEndpoint={async (room) => fetchAuth({ roomId: room })}
    >
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense fallback={<div>Loading collaboration...</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}