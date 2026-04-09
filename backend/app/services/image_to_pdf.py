"""
Image → PDF conversion service.
Uses Pillow to open images and convert them to PDF format.
Supports JPEG, PNG, BMP, WebP, and TIFF formats.
"""

import logging
from pathlib import Path
from PIL import Image

logger = logging.getLogger(__name__)

# Supported image extensions
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tiff", ".tif"}


def convert_image_to_pdf(input_paths: list[Path], output_path: Path) -> Path:
    """
    Convert image files to a single PDF document.

    Opens the images with Pillow, converts to RGB (required for PDF),
    and saves as a multi-page PDF document.

    Args:
        input_paths: Paths to the source image files
        output_path: Path where the PDF file will be saved
    """
    if not input_paths:
        raise ValueError("No input files provided")

    for p in input_paths:
        ext = p.suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(
                f"Unsupported image format: {ext}. "
                f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
            )

    output_path = output_path.with_suffix(".pdf")
    logger.info(f"Converting {len(input_paths)} Image(s) → PDF: {output_path.name}")

    try:
        images = []
        for p in input_paths:
            img = Image.open(p)
            logger.info(f"Image {p.name}: {img.size[0]}x{img.size[1]}, mode={img.mode}")

            # Convert to RGB
            if img.mode in ("RGBA", "LA"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1])
                images.append(background)
            elif img.mode != "RGB":
                images.append(img.convert("RGB"))
            else:
                # We must copy to avoid closing file handle before save
                images.append(img.copy())
            img.close()

        if images:
            first_image = images[0]
            if len(images) > 1:
                first_image.save(
                    str(output_path),
                    "PDF",
                    resolution=150.0,
                    save_all=True,
                    append_images=images[1:]
                )
            else:
                first_image.save(str(output_path), "PDF", resolution=150.0)
            
            # Clean up memory
            for img in images:
                img.close()

    except Exception as e:
        logger.error(f"Image to PDF conversion failed: {e}")
        raise RuntimeError(f"Conversion failed: {str(e)}") from e

    return output_path
