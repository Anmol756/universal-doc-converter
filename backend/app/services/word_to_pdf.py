"""
Word → PDF conversion service.
Uses MS Word via win32com for high-fidelity conversion (Windows only).
"""

import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

def convert_word_to_pdf(input_path: Path, output_path: Path) -> Path:
    """
    Convert a Word (DOCX) file to PDF format.
    Attempts high-fidelity conversion using MS Word.
    """
    if not input_path.exists():
        raise ValueError(f"Input file not found: {input_path}")

    if input_path.suffix.lower() not in (".docx", ".doc"):
        raise ValueError(f"Expected Word file, got: {input_path.suffix}")

    output_path = output_path.with_suffix(".pdf")
    logger.info(f"Converting Word → PDF: {input_path.name} → {output_path.name}")

    try:
        # Attempt to use MS Word via COM for perfect layout preservation
        _convert_with_msword(str(input_path), str(output_path))
        logger.info("Successfully converted using MS Word.")
        return output_path
    except Exception as e:
        logger.error(f"MS Word conversion failed: {e}")
        raise RuntimeError(
            "CRITICAL: High-Fidelity conversion failed. \n"
            "Python tried to use your Microsoft Word application to save the PDF, "
            "but Windows blocked access (COM Access Denied or Word is not installed). \n"
            "Without MS Word or LibreOffice, it is impossible to preserve tables, images, and complex layouts. "
            f"\n\nTechnical Error: {e}"
        )


def _convert_with_msword(input_file: str, output_file: str):
    import win32com.client
    import pythoncom
    
    # Initialize COM in this thread
    pythoncom.CoInitialize()
    
    word = None
    try:
        # Try DispatchEx to force a new instance (sometimes bypasses DCOM permission issues)
        word = win32com.client.DispatchEx("Word.Application")
        word.Visible = False
        
        # Open document (Read-only, no visible window)
        doc = word.Documents.Open(os.path.abspath(input_file), ReadOnly=True, Visible=False)
        
        # Use ExportAsFixedFormat which is specifically designed for high-fidelity PDF export
        # ExportFormat=17 (wdExportFormatPDF)
        # OptimizeFor=1 (wdExportOptimizeForOnScreen) - matches the screen layout instead of reflowing for print
        doc.ExportAsFixedFormat(
            OutputFileName=os.path.abspath(output_file),
            ExportFormat=17,
            OpenAfterExport=False,
            OptimizeFor=1, # 1 = wdExportOptimizeForOnScreen
            CreateBookmarks=1, # wdExportCreateHeadingBookmarks
            DocStructureTags=True,
            BitmapMissingFonts=True,
            UseISO19005_1=False
        )
        doc.Close(SaveChanges=False)
        
    except Exception as e:
        raise RuntimeError(f"COM error: {e}")
    finally:
        if word is not None:
            try:
                word.Quit()
            except:
                pass
        pythoncom.CoUninitialize()
