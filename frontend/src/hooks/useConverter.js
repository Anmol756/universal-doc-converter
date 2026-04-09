/**
 * Custom React hook encapsulating the full upload → convert → download flow.
 * Manages all state transitions and API calls.
 */

import { useState, useCallback } from 'react';
import { uploadFile, convertFile, getDownloadUrl } from '../services/api';

// Possible statuses for the conversion pipeline
export const STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
};

export function useConverter() {
  // ── State ───────────────────────────────────────────────────────
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadData, setUploadData] = useState([]);     // Array of server responses from upload
  const [convertData, setConvertData] = useState(null);    // Server response from convert
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [conversionType, setConversionType] = useState('');

  // ── Upload ──────────────────────────────────────────────────────
  const upload = useCallback(async (selectedFiles) => {
    try {
      const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
      setFiles(filesArray);
      setStatus(STATUS.UPLOADING);
      setUploadProgress(0);
      setError(null);
      setConvertData(null);
      setDownloadUrl(null);

      const progressArray = new Array(filesArray.length).fill(0);

      const uploadPromises = filesArray.map((f, index) => 
        uploadFile(f, (progress) => {
          progressArray[index] = progress;
          const totalProgress = progressArray.reduce((acc, curr) => acc + curr, 0) / filesArray.length;
          setUploadProgress(Math.round(totalProgress));
        })
      );

      const results = await Promise.all(uploadPromises);

      setUploadData(results);
      setStatus(STATUS.UPLOADED);

      // Determine allowed conversions based on single vs multiple files
      let allowed = [];
      if (results.length === 1) {
        allowed = results[0].allowed_conversions || [];
      } else if (results.length > 1) {
        // If multiple files, check if all are PDFs to allow merge
        const allPdfs = results.every(res => res.file_type === 'pdf');
        if (allPdfs) {
          allowed = ['pdf_merge'];
        }
      }

      // We attach allowed to the array itself for easy access in components if needed,
      // or we can just derive it in App.jsx. Let's add a virtual property to uploadData:
      results.allowed_conversions = allowed;

      // Auto-select first available conversion
      if (allowed.length > 0) {
        setConversionType(allowed[0]);
      } else {
         if (results.length > 1) {
             throw new Error("Multiple non-PDF files cannot be combined or processed. Please upload single files or multiple PDFs to merge.");
         }
      }

      return results;
    } catch (err) {
      setError(err.message || 'Upload failed');
      setStatus(STATUS.ERROR);
      throw err;
    }
  }, []);

  const addFiles = useCallback(async (selectedFiles) => {
    try {
      const newFilesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
      setFiles(prev => [...prev, ...newFilesArray]);
      setStatus(STATUS.UPLOADING);
      setError(null);
      
      const progressArray = new Array(newFilesArray.length).fill(0);

      const uploadPromises = newFilesArray.map((f, index) => 
        uploadFile(f, (progress) => {
          progressArray[index] = progress;
          const totalProgress = progressArray.reduce((acc, curr) => acc + curr, 0) / newFilesArray.length;
          setUploadProgress(Math.round(totalProgress));
        })
      );

      const newResults = await Promise.all(uploadPromises);

      setUploadData(prev => {
         const combined = [...prev, ...newResults];
         
         // Update allowed conversions logic
         let allowed = [];
         if (combined.length === 1) {
           allowed = combined[0].allowed_conversions || [];
         } else if (combined.length > 1) {
           const allPdfs = combined.every(res => res.file_type === 'pdf');
           if (allPdfs) allowed = ['pdf_merge'];
         }
         combined.allowed_conversions = allowed;
         if (allowed.length > 0) setConversionType(allowed[0]);
         
         return combined;
      });
      setStatus(STATUS.UPLOADED);
      return newResults;
    } catch (err) {
      setError(err.message || 'Additional upload failed');
      setStatus(STATUS.ERROR);
      throw err;
    }
  }, []);

  // ── Convert ─────────────────────────────────────────────────────
  const convert = useCallback(async (overrideType) => {
    const type = overrideType || conversionType;

    if (!uploadData || uploadData.length === 0) {
      setError('No files uploaded yet');
      setStatus(STATUS.ERROR);
      return;
    }

    if (!type) {
      setError('No conversion type selected');
      setStatus(STATUS.ERROR);
      return;
    }

    try {
      setStatus(STATUS.CONVERTING);
      setError(null);

      // For multiple files, we send their IDs.
      const fileIds = uploadData.map(d => d.file_id);
      
      // Support old signature in api.js by passing single ID or list:
      // Actually convertFile in api.js takes fileId. We need to update api.js or do it here.
      // Wait, api.js might need to support file_ids in the request body. Let's pass fileIds instead.
      // We will need to update api.js convertFile to handle (fileIdOrIds, conversionType).
      const result = await convertFile(fileIds, type);

      setConvertData(result);
      const url = getDownloadUrl(result.file_id);
      setDownloadUrl(url);
      setStatus(STATUS.DONE);

      return result;
    } catch (err) {
      setError(err.message || 'Conversion failed');
      setStatus(STATUS.ERROR);
      throw err;
    }
  }, [uploadData, conversionType]);

  // ── Reset ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setFiles([]);
    setStatus(STATUS.IDLE);
    setUploadProgress(0);
    setUploadData([]);
    setConvertData(null);
    setDownloadUrl(null);
    setError(null);
    setConversionType('');
  }, []);

  return {
    // State
    files, // renamed from file
    status,
    uploadProgress,
    uploadData,
    convertData,
    downloadUrl,
    error,
    conversionType,

    // Actions
    upload,
    addFiles,
    convert,
    reset,
    setConversionType,
  };
}
