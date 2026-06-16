"use client"

import 'react-quill-new/dist/quill.snow.css'

export default function RichTextRenderer({ content }: { content: string }) {
  return (
    <div className="ql-snow" style={{ width: '100%' }}>
      <div 
        className="ql-editor" 
        style={{ padding: 0, fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit', lineHeight: 'inherit' }}
        dangerouslySetInnerHTML={{ __html: content }} 
      />
      <style>{`
        .ql-editor p {
            margin-bottom: 0.75em;
        }
        .ql-editor ul, .ql-editor ol {
            margin-bottom: 1em;
            padding-left: 1.5em;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-weight: 800;
        }
      `}</style>
    </div>
  )
}
