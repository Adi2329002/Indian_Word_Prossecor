"use client";

import { useQuery } from "convex/react";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";

// 👇 1. IMPORT YOUR TOOLBAR (Check if this path is correct for your project)
// If you can't find it, look in your 'src/components' folder.
import { Toolbar } from "./toolbar"; 

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const unwrappedParams = use(params);
  
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId,
  });

  if (document === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading document...</p>
      </div>
    );
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD]">
      <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
         {/* 👇 2. RENDER THE TOOLBAR HERE */}
         <Toolbar />
      </div>
      
      <div className="pt-[114px] print:pt-0">
        <Editor 
          documentId={unwrappedParams.documentId} 
          initialContent={document.initialContent} 
        />
      </div>
    </div>
  );
}