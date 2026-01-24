"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();
  const createDocument = useMutation(api.documents.create);

  const templates = [
    {
      title: "Resume",
      content: "<h1>Your Name</h1><p>Professional Summary...</p>",
    },
    {
      title: "Letter",
      content: "<h1>Formal Letter</h1><p>Dear Sir/Madam...</p>",
    },
    {
      title: "Blog Post",
      content: "<h1>Blog Title</h1><p>Start writing...</p>",
    },
  ];

  const handleTemplateClick = async (template: any) => {
    try {
      const documentId = await createDocument({
        title: template.title,
        content: template.content,
      });

      router.push(`/documents/${documentId}`);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <h1 className="text-3xl font-bold mb-8">Template Gallery</h1>

      <div className="grid grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div
            key={index}
            onClick={() => handleTemplateClick(template)}
            className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold">{template.title}</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Click to use this template
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
