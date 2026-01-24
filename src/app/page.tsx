"use client";

import { useMutation, useQuery } from "convex/react";
// This imports the backend API we defined in convex/documents.ts
import { api } from "../../convex/_generated/api"; 
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  // 1. Hook to fetch your existing documents
  const documents = useQuery(api.documents.get);
  
  // 2. Hook to CREATE a new document
  const createDocument = useMutation(api.documents.create);
  
  // 3. The function that runs when you click the button
  const router = useRouter();
 const onCreate = async () => {
    try {
      const documentId = await createDocument({
        title: "Untitled Document",
        content: "<p></p>",
      });

      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create document");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-white text-black">
      
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
         <p className="text-2xl font-bold">BharatDocs 🇮🇳</p>
         <SignedIn>
            <UserButton afterSignOutUrl="/" />
         </SignedIn>
      </div>

      <div className="flex flex-col items-center gap-4">
        
        <SignedOut>
           <h1 className="text-4xl font-bold mb-4">Welcome to BharatDocs</h1>
           <div className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
              <SignInButton mode="modal" />
           </div>
        </SignedOut>

        <SignedIn>
          {/* THE BUTTON */}
          <button 
            onClick={onCreate}
            className="px-6 py-3 bg-black text-white font-bold rounded hover:opacity-80 transition shadow-lg"
          >
            + Create New Document
          </button>
<button
  onClick={() => router.push("/templates")}
  className="px-6 py-3 bg-[#1a5276] text-white font-semibold rounded hover:opacity-90 transition shadow-md"
>
  📚 Open Template Gallery
</button>

          {/* THE DOCUMENT LIST */}
          <div className="mt-10 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Your Documents</h2>
            
            {documents === undefined ? (
              <p className="text-gray-400">Loading...</p>
            ) : documents.length === 0 ? (
              <p className="text-gray-500">No documents found. Click the button above!</p>
            ) : (
              documents.map((doc) => (
                 <div 
                    key={doc._id} 
                    onClick={() => window.location.href = `/documents/${doc._id}`}
                    className="p-4 border rounded-lg mb-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition"
                 >
                    <span className="font-medium">{doc.title}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(doc._creationTime).toLocaleDateString()}
                    </span>
                 </div>
              ))
            )}
          </div>
        </SignedIn>

      </div>
    </div>
  );
}