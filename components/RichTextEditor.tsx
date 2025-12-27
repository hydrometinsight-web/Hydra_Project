'use client'

import dynamic from 'next/dynamic'
import { useMemo, useEffect, useRef } from 'react'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Wait for Quill to be available
      const initImageResize = () => {
        const editor = document.querySelector('.ql-editor')
        if (!editor) {
          setTimeout(initImageResize, 100)
          return
        }

        // Add click handler for image resize
        const handleImageClick = (e: MouseEvent) => {
          const target = e.target as HTMLImageElement
          if (target.tagName === 'IMG') {
            e.preventDefault()
            e.stopPropagation()
            
            const currentWidth = target.style.width || target.width + 'px' || 'auto'
            const width = prompt('Resim genişliği (px veya %). Örnek: 500px, 80%, auto):', currentWidth)
            
            if (width !== null) {
              if (width === 'auto' || width === '') {
                target.style.width = ''
                target.style.height = ''
                target.removeAttribute('width')
                target.removeAttribute('height')
              } else {
                const widthValue = width.includes('%') || width.includes('px') ? width : width + 'px'
                target.style.width = widthValue
                target.style.height = 'auto'
                target.setAttribute('width', widthValue)
              }
              
              // Trigger onChange to save the change
              if (quillRef.current) {
                const quill = quillRef.current.getEditor()
                const content = quill.root.innerHTML
                onChange(content)
              }
            }
          }
        }

        editor.addEventListener('click', handleImageClick)
        
        return () => {
          editor.removeEventListener('click', handleImageClick)
        }
      }

      const cleanup = initImageResize()
      return cleanup
    }
  }, [onChange])

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
          min-height: 300px;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 300px;
        }
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .ql-editor img {
          cursor: pointer;
          max-width: 100%;
          height: auto;
          transition: opacity 0.2s;
        }
        .ql-editor img:hover {
          opacity: 0.8;
          outline: 2px solid #93D419;
          outline-offset: 2px;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  )
}

