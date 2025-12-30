'use client'

import dynamic from 'next/dynamic'
import { useMemo, useEffect, useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  className = '',
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)
  const [quill, setQuill] = useState<any>(null)

  // Initialize Quill with custom image handler
  useEffect(() => {
    if (quillRef.current && !quill) {
      const attachQuillRefs = () => {
        if (quillRef.current) {
          const editor = quillRef.current.getEditor()
          
          if (editor && editor.getModule) {
            try {
              // Custom image handler for upload
              const toolbar = editor.getModule('toolbar')
              if (toolbar) {
                toolbar.addHandler('image', function() {
                  const input = document.createElement('input')
                  input.setAttribute('type', 'file')
                  input.setAttribute('accept', 'image/*')
                  input.click()
                  
                  input.onchange = async () => {
                    const file = input.files?.[0]
                    if (file) {
                      // Upload to server
                      const formData = new FormData()
                      formData.append('file', file)
                      
                      try {
                        const response = await fetch('/api/admin/upload', {
                          method: 'POST',
                          body: formData,
                        })
                        const data = await response.json()
                        
                        if (data.url) {
                          const range = editor.getSelection(true)
                          editor.insertEmbed(range.index, 'image', data.url)
                        }
                      } catch (error) {
                        console.error('Image upload failed:', error)
                        // Fallback to base64
                        const reader = new FileReader()
                        reader.onload = () => {
                          const range = editor.getSelection(true)
                          editor.insertEmbed(range.index, 'image', reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }
                  }
                })
              }
            } catch (error) {
              console.error('Error setting up image handler:', error)
            }
          }
          
          setQuill(editor)
        }
      }
      
      // Wait for ReactQuill to be ready
      const timer = setTimeout(attachQuillRefs, 100)
      return () => clearTimeout(timer)
    }
  }, [quill])

  // Drag & drop image upload
  useEffect(() => {
    if (!quill) return

    const editor = quill.root
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith('image/')) {
          const formData = new FormData()
          formData.append('file', file)
          
          fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
            .then(res => res.json())
            .then(data => {
              if (data.url) {
                const range = quill.getSelection(true) || { index: quill.getLength() }
                quill.insertEmbed(range.index, 'image', data.url)
              }
            })
            .catch(() => {
              // Fallback to base64
              const reader = new FileReader()
              reader.onload = () => {
                const range = quill.getSelection(true) || { index: quill.getLength() }
                quill.insertEmbed(range.index, 'image', reader.result as string)
              }
              reader.readAsDataURL(file)
            })
        }
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    editor.addEventListener('drop', handleDrop)
    editor.addEventListener('dragover', handleDragOver)

    return () => {
      editor.removeEventListener('drop', handleDrop)
      editor.removeEventListener('dragover', handleDragOver)
    }
  }, [quill])

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  }), [])

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ]

  return (
    <div className={className}>
      <style jsx global>{`
        .quill {
          background: white;
        }
        .ql-container {
          min-height: 400px;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 400px;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .ql-editor img {
          cursor: move;
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px auto;
        }
        .ql-editor img:hover {
          outline: 2px solid #93D419;
          outline-offset: 2px;
        }
        /* Image resize handles */
        .ql-editor img.ql-image-selected {
          outline: 2px solid #93D419;
        }
        /* Drag & drop indicator */
        .ql-editor.ql-drag-over {
          background-color: #f0f9ff;
          border: 2px dashed #93D419;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}
