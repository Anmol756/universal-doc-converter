"""
LibreOffice Conversion Service.
Uses subprocess to call LibreOffice headless mode for maximum formatting preservation.
"""

import subprocess
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)

# Timeout for libreoffice commands (in seconds)
TIMEOUT_SECONDS = 300

def _run_libreoffice(cmd_args, timeout=TIMEOUT_SECONDS):
    """
    Attempt to run libreoffice with the given arguments.
    Checks common paths if the executable is not in the system PATH.
    """
    executables = [
        "libreoffice",
        "soffice",
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
        "/usr/bin/libreoffice",
        "/usr/bin/soffice",
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    ]
    
    last_err = None
    for exe in executables:
        try:
            cmd = [exe] + cmd_args
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=timeout
            )
            
            # If we get a valid return code (even non-zero), we found the executable.
            # But if the executable itself was completely invalid or missing some DLLs, it might fail differently.
            # Usually, if it runs, we return the result.
            return result
        except FileNotFoundError as e:
            last_err = e
            continue
        except OSError as e:
            # On Windows, [WinError 2] is an OSError
            last_err = e
            if e.winerror == 2:
                continue
            raise e
            
    raise FileNotFoundError(f"Could not find LibreOffice executable. Checked: {executables}. Last error: {last_err}")


def convert_with_libreoffice(input_path: Path, output_dir: Path, target_format: str) -> Path:
    """
    Convert a document using LibreOffice headless mode.

    Args:
        input_path: Path to the input file.
        output_dir: Path to the directory where the output should be saved.
        target_format: The target format extension (e.g., "pdf", "docx").

    Returns:
        Path to the converted file.

    Raises:
        RuntimeError: If the conversion fails or times out.
    """
    logger.info(f"Starting LibreOffice conversion for {input_path.name} to {target_format}")
    
    cmd_args = [
        "--headless",
        "--convert-to",
        target_format,
        "--outdir",
        str(output_dir),
        str(input_path)
    ]
    
    try:
        result = _run_libreoffice(cmd_args)
        
        if result.returncode != 0:
            logger.error(f"LibreOffice conversion failed: {result.stderr}")
            raise RuntimeError(f"Conversion failed: {result.stderr}")

        # Construct the expected output path
        output_filename = input_path.stem + f".{target_format}"
        output_path = output_dir / output_filename
        
        if not output_path.exists():
             logger.error(f"Output file not found at {output_path}. LibreOffice output: {result.stdout} {result.stderr}")
             raise RuntimeError("Output file was not generated.")

        return output_path

    except subprocess.TimeoutExpired:
        logger.error(f"LibreOffice conversion timed out after {TIMEOUT_SECONDS}s")
        raise RuntimeError("Conversion timed out. The document might be too large or complex.")
    except Exception as e:
        logger.error(f"Error during LibreOffice conversion: {e}")
        raise RuntimeError(f"Error during conversion: {e}")

def convert_pdf_to_word(input_path: Path, output_path: Path) -> Path:
    """Convert PDF to DOCX using LibreOffice."""
    cmd_args = [
        "--headless",
        "--infilter=writer_pdf_import",
        "--convert-to",
        "docx",
        "--outdir",
        str(output_path.parent),
        str(input_path)
    ]
    
    try:
        result = _run_libreoffice(cmd_args)
            
        if result.returncode != 0:
            raise RuntimeError(f"Conversion failed: {result.stderr}")
            
        output_filename = input_path.stem + ".docx"
        generated_path = output_path.parent / output_filename
        
        if generated_path.exists():
            # Rename to the requested output_path
            generated_path.rename(output_path)
            return output_path
        else:
            raise RuntimeError("Output file was not generated.")
            
    except subprocess.TimeoutExpired:
        raise RuntimeError("Conversion timed out.")
    except Exception as e:
        raise RuntimeError(f"Error during conversion: {e}")

def convert_word_to_pdf(input_path: Path, output_path: Path) -> Path:
    """Convert DOCX to PDF using LibreOffice."""
    try:
        generated_path = convert_with_libreoffice(input_path, output_path.parent, "pdf")
        if generated_path.exists():
             # Rename to the requested output_path
             generated_path.rename(output_path)
             return output_path
        else:
             raise RuntimeError("Output file was not generated.")
    except Exception as e:
        raise RuntimeError(f"Error during conversion: {e}")
