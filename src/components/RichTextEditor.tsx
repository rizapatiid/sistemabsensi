"use client"

import dynamic from "next/dynamic"
import { useMemo, useEffect, useState } from "react"
import 'react-quill-new/dist/quill.snow.css'

// Dynamic import ReactQuill to avoid SSR "document is not defined" error
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div style={{ height: "300px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Memuat editor...</div>
})

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }), [])

  if (!mounted) return <div style={{ height: "300px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Memuat editor...</div>

  return (
    <div className="rich-text-editor-container" style={{ position: 'relative', zIndex: 10 }}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder || "Tuliskan konten di sini..."}
      />
      <style>{`
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          border-color: #e2e8f0 !important;
          background: #f1f5f9;
          font-family: inherit;
          padding: 12px 8px !important;
        }
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border-color: #e2e8f0 !important;
          border-top: none !important;
          min-height: 250px;
          font-size: 0.95rem;
          font-family: inherit;
          background: #ffffff;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 250px;
          line-height: 1.7;
          color: #0f172a;
          padding: 16px 20px;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        .rich-text-editor-container .ql-picker {
          color: #475569;
        }
      `}</style>
    </div>
  )
}
