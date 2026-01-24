"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { TEMPLATES } from "@/lib/templates"

export default function TemplatesPage() {
  const router = useRouter()
  const createDocument = useMutation(api.documents.create)

  const handleCreate = async (template: any) => {
    const id = await createDocument({
      title: template.title,
      content: template.content,
    })

    router.push(`/documents/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD] p-10">
      <h1 className="text-3xl font-bold mb-8">Template Gallery</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            onClick={() => handleCreate(template)}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
              Preview
            </div>
            <h2 className="font-semibold">{template.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
