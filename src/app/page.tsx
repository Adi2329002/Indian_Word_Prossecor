"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api"; 
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./(auth)/signin/signin";
import { useTheme } from "next-themes";
import { useState } from "react"; // Added useState
import { DocumentMenu } from "@/components/ui/document-menu";
import { 
  Plus, 
  FileText, 
  MoreVertical, 
  SunIcon, 
  MoonIcon, 
  Search,
  FileBox,
  X // Added for clearing search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState(""); // 1. Added Search State

  const documents = useQuery(api.documents.get);
  const createDocument = useMutation(api.documents.create);

  // 2. Added Filter Logic
  const filteredDocuments = documents?.filter((doc) =>
    doc.title?.toLowerCase().includes(search.toLowerCase())
  );

  const onCreate = () => {
    createDocument({ title: "Untitled Document" })
      .then((documentId) => {
        window.location.href = `/documents/${documentId}`;
      })
      .catch((error) => {
        alert("Failed to create: " + error);
      });
  };

  return (
    <div className="min-h-screen">
      <SignedOut>
        {/* ... sign out state remains same ... */}
        <div className="min-h-screen bg-[#0b0d0f] text-white">
          <div className="relative min-h-screen overflow-hidden">
             <SignInPage />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-background flex flex-col text-foreground">
          
          <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BharatDocs Logo" className="h-8 w-10 object-contain" />
              <span className="font-bold text-xl text-[#F69836]">Bharat</span>
              <span className="text-xl text-[#2F87C7]">Docs</span>
            </div>

            {/* 3. Updated Search Input */}
            <div className="hidden md:flex items-center relative max-w-md w-full mx-8">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input 
                placeholder="Search documents..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 bg-muted/50 border-transparent focus-visible:ring-blue-500 rounded-full h-10 text-sm"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")}
                  className="absolute right-3 hover:text-blue-500 transition-colors"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                className="h-9 px-3 rounded-full text-muted-foreground hover:bg-muted"
              >
                {theme === "dark" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                <span className="text-xs font-medium ml-2">{theme === "dark" ? "Dark" : "Light"}</span>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10 flex flex-col gap-12">
            <section className="flex flex-col gap-6">
              <h2 className="text-lg font-medium text-foreground">Start a new document</h2>
              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-2 w-36">
                  <button 
                    onClick={onCreate}
                    className="h-48 w-36 bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center group"
                  >
                    <Plus className="w-12 h-12 text-blue-500 mb-2" strokeWidth={1.5} />
                  </button>
                  <span className="text-sm font-medium text-center">Blank document</span>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <h2 className="text-lg font-medium text-foreground">
                  {search ? `Results for "${search}"` : "Recent documents"}
                </h2>
              </div>

              {/* 4. Use filteredDocuments for display */}
              {filteredDocuments === undefined ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground italic animate-pulse">
                  Searching documents...
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-border border-dashed">
                  <FileBox className="w-10 h-10 mb-4 opacity-20" />
                  <p>{search ? "No matching documents found." : "No documents found yet."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredDocuments.map((doc) => (
                    <div 
                      key={doc._id}
                      onClick={() => (window.location.href = `/documents/${doc._id}`)}
                      className="flex flex-col bg-card border border-border rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="h-36 bg-muted/30 border-b border-border flex items-center justify-center p-4">
                        <div className="w-full h-full bg-background border border-border/50 shadow-sm rounded p-3" />
                      </div>
                      
                      <div className="p-3 flex items-center justify-between bg-card">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate text-foreground group-hover:text-blue-500 transition-colors">
                              {doc.title || "Untitled Document"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {new Date(doc._creationTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* 👇 REPLACE THE OLD MoreVertical WITH THIS 👇 */}
                        <div onClick={(e) => e.stopPropagation()}> 
                          <DocumentMenu 
                             documentId={doc._id} 
                             title={doc.title || "Untitled Document"} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </SignedIn>
    </div>
  );
}