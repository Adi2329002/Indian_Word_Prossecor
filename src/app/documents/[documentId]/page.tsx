"use client";

import { useQuery , useMutation } from "convex/react";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";
import { Room } from "./room"
import { Toolbar } from "./toolbar"; 

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const unwrappedParams = use(params);
  
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId as Id<"documents">,
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
    // Pass the resolved documentId to the Room
    <Room roomId={unwrappedParams.documentId}>
      <div className="min-h-screen bg-[#F9FBFD]">
       <div className="fixed top-0 left-0 right-0 z-10 print:hidden">
  <Toolbar document={document} />
</div>

        
        <div className="pt-[114px] print:pt-0">
          <Editor /> 
        </div>
      </div>
    </Room>
  );
}