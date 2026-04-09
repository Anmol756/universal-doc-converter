"""
Storage abstraction layer.
Currently implements local filesystem storage.
Designed for easy extension to S3 or other cloud providers.
"""

import os
from abc import ABC, abstractmethod
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class StorageBackend(ABC):
    """Abstract base class for storage backends."""

    @abstractmethod
    def save(self, data: bytes, path: str) -> str:
        """Save data and return the storage path."""
        ...

    @abstractmethod
    def get(self, path: str) -> Path | None:
        """Get the local path to a stored file."""
        ...

    @abstractmethod
    def delete(self, path: str) -> bool:
        """Delete a stored file."""
        ...

    @abstractmethod
    def exists(self, path: str) -> bool:
        """Check if a file exists in storage."""
        ...


class LocalStorage(StorageBackend):
    """Local filesystem storage implementation."""

    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def save(self, data: bytes, filename: str) -> str:
        """Save bytes to local filesystem."""
        file_path = self.base_dir / filename
        file_path.write_bytes(data)
        logger.info(f"Saved file: {filename} ({len(data)} bytes)")
        return str(file_path)

    def get(self, filename: str) -> Path | None:
        """Get path to a local file."""
        file_path = self.base_dir / filename
        if file_path.exists():
            return file_path
        return None

    def delete(self, filename: str) -> bool:
        """Delete a file from local storage."""
        file_path = self.base_dir / filename
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Deleted file: {filename}")
                return True
        except OSError as e:
            logger.warning(f"Failed to delete {filename}: {e}")
        return False

    def exists(self, filename: str) -> bool:
        """Check if a file exists locally."""
        return (self.base_dir / filename).exists()


# ── Future: S3 Storage ──────────────────────────────────────────────────
# class S3Storage(StorageBackend):
#     def __init__(self, bucket_name: str, region: str = "us-east-1"):
#         import boto3
#         self.s3 = boto3.client("s3", region_name=region)
#         self.bucket = bucket_name
#
#     def save(self, data: bytes, path: str) -> str:
#         self.s3.put_object(Bucket=self.bucket, Key=path, Body=data)
#         return f"s3://{self.bucket}/{path}"
#
#     def get(self, path: str) -> str | None:
#         # Generate presigned URL
#         url = self.s3.generate_presigned_url(
#             "get_object",
#             Params={"Bucket": self.bucket, "Key": path},
#             ExpiresIn=3600,
#         )
#         return url
#
#     def delete(self, path: str) -> bool:
#         self.s3.delete_object(Bucket=self.bucket, Key=path)
#         return True
#
#     def exists(self, path: str) -> bool:
#         try:
#             self.s3.head_object(Bucket=self.bucket, Key=path)
#             return True
#         except:
#             return False
