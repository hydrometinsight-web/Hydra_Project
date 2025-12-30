import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/security'
import { prisma } from '@/lib/prisma'
import jsPDF from 'jspdf'

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pdfWidth - 2 * margin
    let yPosition = 20

    // Title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    const titleLines = pdf.splitTextToSize(campaign.subject, maxWidth)
    pdf.text(titleLines, margin, yPosition)
    yPosition += titleLines.length * 7 + 10

    // Date
    if (campaign.sentAt) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const dateStr = new Date(campaign.sentAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      pdf.text(dateStr, margin, yPosition)
      yPosition += 7
    }

    // Content
    yPosition += 5
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')

    // Use HTML content if available, otherwise use plain text
    const content = campaign.htmlContent || campaign.content

    // Simple HTML stripping for PDF
    const textContent = content
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Multiple spaces to single space
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

    // Footer
    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'italic')
      pdf.text(
        `HydroMetInsight Newsletter - Page ${i} of ${pageCount}`,
        pdfWidth / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Convert to base64
    const pdfBase64 = pdf.output('datauristring')

    return NextResponse.json({
      success: true,
      pdf: pdfBase64,
      filename: `${campaign.subject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
    })
  } catch (error) {
    console.error('Error generating newsletter PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}

