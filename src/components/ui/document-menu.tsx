"use client";

import { MoreVertical, Trash, Pencil, ExternalLink } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DocumentMenuProps {
  documentId: Id<"documents">;
  title: string;
}

export const DocumentMenu = ({ documentId, title }: DocumentMenuProps) => {
  const remove = useMutation(api.documents.remove); // You'll need to define this in Convex
  const update = useMutation(api.documents.update); // Points to your existing update function
  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      remove({ id: documentId });
    }
  };
  const onRename = (e: React.MouseEvent) => {
  e.stopPropagation();
  const newTitle = window.prompt("Enter new title:", title);
  
  if (newTitle && newTitle !== title) {
    update({ id: documentId, title: newTitle })
      .catch(() => alert("Failed to rename document"));
  }
};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center outline-none">
          <MoreVertical className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => window.open(`/documents/${documentId}`, "_blank")}>
          <ExternalLink className="size-4 mr-2" /> Open in new tab
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
          <Trash className="size-4 mr-2" /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRename}>
            <Pencil className="size-4 mr-2" /> Rename
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};