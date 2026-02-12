"use client";

import { useQuery } from "convex/react";
import { use } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Editor } from "./editor";
import { Room } from "./room";
import { Toolbar } from "./toolbar"; 
import { useEditorStore } from "@/store/use-editor-store"; // Import store
import { Button } from "@/components/ui/button"; // Import your button component
import { EyeOff } from "lucide-react"; // For the exit icon
import { cn } from "@/lib/utils";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const unwrappedParams = use(params);
  const { isPresentationMode, togglePresentationMode } = useEditorStore(); // Hook into store
  
  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId as Id<"documents">,
  });

  if (document === undefined) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (document === null) return <div>Document not found</div>;

  return ( 
    <Room roomId={unwrappedParams.documentId}>
      <div className={cn(
        "min-h-screen transition-colors duration-300",
        isPresentationMode ? "bg-white" : "bg-[#F9FBFD]"
      )}>
        {/* HIDE TOOLBAR: Only show if NOT in preview mode */}
        {!isPresentationMode && (
          <div className="flex flex-col px-4 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden border-b">
             <Toolbar />
          </div>
        )}
        
        {/* REMOVE PADDING: Set pt-0 when previewing to move document to top */}
        <div className={cn(
          "transition-all duration-300",
          isPresentationMode ? "pt-1" : "pt-[120px] print:pt-0"
        )}>
          <Editor /> 
        </div>

        {/* FLOATING EXIT BUTTON: Only visible in preview mode */}
        {isPresentationMode && (
          <Button
            onClick={togglePresentationMode}
            variant="outline"
            className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:bg-slate-100 gap-2 px-6"
          >
            <EyeOff className="size-4" />
            Exit Preview / बंद करें
          </Button>
        )}
      </div>
    </Room>
  );
}