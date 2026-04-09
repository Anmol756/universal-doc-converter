"""
Word → PDF conversion service.
Uses python-docx to read the DOCX and reportlab to generate a PDF.
This is a portable approach that works without MS Word or LibreOffice.

Note: For higher fidelity conversion in production, consider using
docx2pdf (requires MS Word) or LibreOffice command-line conversion.
"""

import logging
from pathlib import Path

from docx import Document
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

logger = logging.getLogger(__name__)


def convert_word_to_pdf(input_path: Path, output_path: Path) -> Path:
    """
    Convert a Word (DOCX) file to PDF format.

    Uses python-docx for reading and reportlab for PDF generation.
    Preserves text content and basic paragraph structure.

    Args:
        input_path: Path to the source DOCX file
        output_path: Path where the PDF file will be saved

    Returns:
        Path to the converted PDF file

    Raises:
        ValueError: If input file doesn't exist or is not a DOCX
        RuntimeError: If conversion fails
    """
    if not input_path.exists():
        raise ValueError(f"Input file not found: {input_path}")

    if input_path.suffix.lower() not in (".docx", ".doc"):
        raise ValueError(f"Expected Word file, got: {input_path.suffix}")

    # Ensure output has .pdf extension
    output_path = output_path.with_suffix(".pdf")

    logger.info(f"Converting Word → PDF: {input_path.name} → {output_path.name}")

    try:
        # Read the DOCX document
        doc = Document(str(input_path))

        # Set up the PDF document
        pdf = SimpleDocTemplate(
            str(output_path),
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
        )

        # Define styles
        styles = getSampleStyleSheet()
        style_normal = ParagraphStyle(
            "CustomBody",
            parent=styles["Normal"],
            fontSize=11,
            leading=16,
            spaceAfter=8,
            alignment=TA_JUSTIFY,
            fontName="Helvetica",
        )
        style_heading1 = ParagraphStyle(
            "CustomH1",
            parent=styles["Heading1"],
            fontSize=18,
            leading=24,
            spaceAfter=12,
            spaceBefore=16,
            fontName="Helvetica-Bold",
        )
        style_heading2 = ParagraphStyle(
            "CustomH2",
            parent=styles["Heading2"],
            fontSize=14,
            leading=20,
            spaceAfter=10,
            spaceBefore=12,
            fontName="Helvetica-Bold",
        )

        # Build the PDF content from DOCX paragraphs
        story = []

        for paragraph in doc.paragraphs:
            text = paragraph.text.strip()
            if not text:
                story.append(Spacer(1, 6))
                continue

            # Apply appropriate style based on paragraph style name
            style_name = paragraph.style.name.lower() if paragraph.style else ""

            if "heading 1" in style_name or "title" in style_name:
                story.append(Paragraph(text, style_heading1))
            elif "heading 2" in style_name or "subtitle" in style_name:
                story.append(Paragraph(text, style_heading2))
            else:
                # Handle bold/italic inline formatting
                formatted_text = _format_paragraph_runs(paragraph)
                story.append(Paragraph(formatted_text, style_normal))

        # If document is empty, add a placeholder
        if not story:
            story.append(Paragraph("(Empty document)", style_normal))

        pdf.build(story)

    except Exception as e:
        logger.error(f"Word to PDF conversion failed: {e}")
        raise RuntimeError(f"Conversion failed: {str(e)}") from e

    if not output_path.exists():
        raise RuntimeError("Conversion produced no output file")

    logger.info(f"Conversion complete: {output_path.name} ({output_path.stat().st_size} bytes)")
    return output_path


def _format_paragraph_runs(paragraph) -> str:
    """
    Convert paragraph runs to ReportLab markup,
    preserving basic bold/italic formatting.
    """
    parts = []
    for run in paragraph.runs:
        text = run.text
        if not text:
            continue

        # Escape XML special characters for ReportLab
        text = (
            text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
        )

        if run.bold and run.italic:
            parts.append(f"<b><i>{text}</i></b>")
        elif run.bold:
            parts.append(f"<b>{text}</b>")
        elif run.italic:
            parts.append(f"<i>{text}</i>")
        else:
            parts.append(text)

    return "".join(parts) if parts else paragraph.text or ""
