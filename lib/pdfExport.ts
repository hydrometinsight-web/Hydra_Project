import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface PDFExportOptions {
  title: string
  author?: string
  date?: string
  filename?: string
}

// Helper function to add header to PDF pages
function addPDFHeader(pdf: jsPDF, logoData?: string) {
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const headerHeight = 25

  // Add header background
  pdf.setFillColor(147, 212, 25) // #93D419 color
  pdf.rect(0, 0, pdfWidth, headerHeight, 'F')

  // Add logo if available
  if (logoData) {
    try {
      pdf.addImage(logoData, 'PNG', 10, 5, 15, 15)
    } catch (error) {
      console.warn('Could not add logo to PDF:', error)
    }
  }

  // Add site name
  pdf.setTextColor(0, 0, 0) // Black text
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('HydroMetInsight', logoData ? 30 : 10, 15)

  // Add line separator
  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.5)
  pdf.line(0, headerHeight, pdfWidth, headerHeight)

  return headerHeight
}

// Helper function to load logo as base64
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    const response = await fetch('/logo1.png')
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Could not load logo:', error)
    return null
  }
}

export async function exportToPDF(
  elementId: string,
  options: PDFExportOptions
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  // Show loading indicator
  const loadingIndicator = document.createElement('div')
  loadingIndicator.id = 'pdf-loading'
  loadingIndicator.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px 40px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 16px;
  `
  loadingIndicator.textContent = 'Generating PDF...'
  document.body.appendChild(loadingIndicator)

  try {
    // Load logo
    const logoData = await loadLogoAsBase64()

    // Create a clone of the element for PDF generation
    const clone = element.cloneNode(true) as HTMLElement
    clone.style.width = `${element.offsetWidth}px`
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    document.body.appendChild(clone)

    // Configure html2canvas options
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    // Remove clone
    document.body.removeChild(clone)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const headerHeight = addPDFHeader(pdf, logoData || undefined)
    const contentStartY = headerHeight + 10

    // Calculate image dimensions
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const availableWidth = pdfWidth - 2 * margin
    const availableHeight = pdfHeight - contentStartY - 10
    const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)
    const imgScaledWidth = imgWidth * ratio
    const imgScaledHeight = imgHeight * ratio

    // Add title on first page (with proper text wrapping)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 0, 0)
    const titleMaxWidth = pdfWidth - 2 * margin
    const titleLines = pdf.splitTextToSize(options.title, titleMaxWidth)
    let titleY = contentStartY + 5
    
    // Check if title fits, if not start on new page
    if (titleY + titleLines.length * 6 > pdfHeight - 20) {
      pdf.addPage()
      addPDFHeader(pdf, logoData || undefined)
      titleY = headerHeight + 10
    }
    
    pdf.text(titleLines, margin, titleY)
    let currentY = titleY + titleLines.length * 6 + 5

    // Add author and date
    if (options.author || options.date) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      
      if (currentY > pdfHeight - 15) {
        pdf.addPage()
        addPDFHeader(pdf, logoData || undefined)
        currentY = headerHeight + 10
      }

      if (options.author) {
        pdf.text(`By: ${options.author}`, margin, currentY)
        currentY += 5
      }
      
      if (options.date) {
        pdf.text(options.date, margin, currentY)
        currentY += 8
      }
    }

    // Add separator line
    if (currentY > pdfHeight - 15) {
      pdf.addPage()
      addPDFHeader(pdf, logoData || undefined)
      currentY = headerHeight + 10
    }
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.line(margin, currentY, pdfWidth - margin, currentY)
    currentY += 10

    // Add content image
    if (currentY + imgScaledHeight > pdfHeight - 10) {
      pdf.addPage()
      addPDFHeader(pdf, logoData || undefined)
      currentY = headerHeight + 10
    }

    let heightLeft = imgScaledHeight
    let position = currentY

    pdf.addImage(imgData, 'PNG', margin, position, imgScaledWidth, imgScaledHeight)
    heightLeft -= (pdfHeight - position - 10)

    // Add remaining pages with header
    while (heightLeft > 0) {
      pdf.addPage()
      addPDFHeader(pdf, logoData || undefined)
      position = headerHeight + 10
      const pageImgHeight = Math.min(heightLeft, pdfHeight - position - 10)
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        position,
        imgScaledWidth,
        imgScaledHeight,
        undefined,
        'FAST',
        0,
        imgScaledHeight - heightLeft
      )
      heightLeft -= (pdfHeight - position - 10)
    }

    // Save PDF
    const filename = options.filename || `${options.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    // Remove loading indicator
    const loading = document.getElementById('pdf-loading')
    if (loading) {
      document.body.removeChild(loading)
    }
  }
}

export function exportContentToPDF(
  title: string,
  content: string,
  options: {
    author?: string
    date?: string
    excerpt?: string
  } = {}
): void {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const margin = 20
  const maxWidth = pdfWidth - 2 * margin
  let yPosition = 20

  // Title
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  const titleLines = pdf.splitTextToSize(title, maxWidth)
  pdf.text(titleLines, margin, yPosition)
  yPosition += titleLines.length * 7 + 10

  // Author
  if (options.author) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`By: ${options.author}`, margin, yPosition)
    yPosition += 7
  }

  // Date
  if (options.date) {
    pdf.setFontSize(10)
    pdf.text(options.date, margin, yPosition)
    yPosition += 7
  }

  // Excerpt
  if (options.excerpt) {
    yPosition += 5
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'italic')
    const excerptLines = pdf.splitTextToSize(options.excerpt, maxWidth)
    pdf.text(excerptLines, margin, yPosition)
    yPosition += excerptLines.length * 5 + 10
  }

  // Content (strip HTML and format)
  yPosition += 5
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  // Simple HTML stripping
  const textContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()

  const contentLines = pdf.splitTextToSize(textContent, maxWidth)
  
  for (let i = 0; i < contentLines.length; i++) {
    if (yPosition > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage()
      yPosition = 20
    }
    pdf.text(contentLines[i], margin, yPosition)
    yPosition += 5
  }

  // Save PDF
  const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
  pdf.save(filename)
}

