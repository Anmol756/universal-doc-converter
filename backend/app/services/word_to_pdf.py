"""
Word → PDF conversion service.
Uses MS Word via win32com for high-fidelity conversion (Windows only).
"""

import logging
import os
import platform
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)

def convert_word_to_pdf(input_path: Path, output_path: Path) -> Path:
    """
    Convert a Word (DOCX) file to PDF format.
    Uses MS Word on Windows, and LibreOffice Headless on Linux.
    """
    if not input_path.exists():
        raise ValueError(f"Input file not found: {input_path}")

    if input_path.suffix.lower() not in (".docx", ".doc"):
        raise ValueError(f"Expected Word file, got: {input_path.suffix}")

    output_path = output_path.with_suffix(".pdf")
    logger.info(f"Converting Word → PDF: {input_path.name} → {output_path.name}")

    if platform.system() == "Windows":
        try:
            _convert_with_msword(str(input_path), str(output_path))
            logger.info("Successfully converted using MS Word on Windows.")
            return output_path
        except Exception as e:
            logger.error(f"MS Word conversion failed: {e}")
            raise RuntimeError(f"High-Fidelity conversion failed via MS Word. Technical Error: {e}")
    else:
        # Linux / Docker / Render Environment
        try:
            _convert_with_libreoffice(input_path, output_path)
            logger.info("Successfully converted using LibreOffice on Linux.")
            return output_path
        except Exception as e:
            logger.error(f"LibreOffice conversion failed: {e}")
            raise RuntimeError(f"High-Fidelity conversion failed via LibreOffice. Technical Error: {e}")

def _convert_with_libreoffice(input_file: Path, output_file: Path):
    import uuid
    import shutil
    
    # Generate a unique profile directory for this specific conversion
    # This completely eliminates concurrency crashes in headless mode
    profile_dir = Path(f"/tmp/lo_profile_{uuid.uuid4().hex}")
    
    cmd = [
        "libreoffice",
        f"-env:UserInstallation=file://{profile_dir}",
        "--headless",
        "--convert-to", "pdf:writer_pdf_Export",
        "--outdir", str(output_file.parent),
        str(input_file)
    ]
    
    try:
        # Run the LibreOffice conversion
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise RuntimeError(f"LibreOffice error: {result.stderr or result.stdout}")
    finally:
        # Clean up the isolated profile to save disk space on Render
        if profile_dir.exists():
            shutil.rmtree(profile_dir, ignore_errors=True)
        
    # LibreOffice creates the output file using the input file's base name
    # e.g. input.docx -> input.pdf in the outdir
    expected_generated_file = output_file.parent / f"{input_file.stem}.pdf"
    
    if expected_generated_file.exists():
        # Rename it to the actual requested output_file (often a UUID in our backend)
        # Handle the case where the input and output have the exact same name
        if expected_generated_file.resolve() != output_file.resolve():
            # Remove output_file if it exists before renaming, to avoid FileExistsError on Windows
            if output_file.exists():
                output_file.unlink()
            expected_generated_file.rename(output_file)
    else:
        raise RuntimeError("LibreOffice finished, but the PDF was not created.")


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
