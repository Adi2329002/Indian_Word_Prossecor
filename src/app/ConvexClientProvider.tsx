"use client";

import { ReactNode } from "react";
import { AuthLoading, Authenticated, Unauthenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignInButton } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* State 1: Loading... show a spinner */}
        <AuthLoading>
          <div className="h-screen w-full flex items-center justify-center">
            Loading...
          </div>
        </AuthLoading>
        
        {/* State 2: Not Logged In... show the document but read-only, or login button */}
        <Unauthenticated>
          {children} 
        </Unauthenticated>

        {/* State 3: Logged In... show the app */}
        <Authenticated>
          {children}
        </Authenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}