'use client';

import { useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  label: string;
  fileId: string;
  accept?: string;
  maxSize?: number; // in MB
  currentFile?: string;
  onFileChange: (fileName: string, file: File | null) => void;
  error?: string | null;
  isListening?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  voicePrompt?: string;
  language?: string;
}

export function FileUpload({
  label,
  fileId,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 5,
  currentFile,
  onFileChange,
  error,
  isListening = false,
  onStartRecording,
  onStopRecording,
  voicePrompt,
  language = 'en',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = language === 'hi' 
        ? `फ़ाइल का आकार ${maxSize}MB से बड़ा नहीं हो सकता. आपकी फ़ाइल ${(file.size / (1024 * 1024)).toFixed(2)}MB है।`
        : `File size cannot exceed ${maxSize}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
      setFileError(errorMsg);
      return false;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      const errorMsg = language === 'hi'
        ? `केवल ये फ़ाइलें स्वीकृत हैं: ${allowedTypes.join(', ')}`
        : `Only these file types are accepted: ${allowedTypes.join(', ')}`;
      setFileError(errorMsg);
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileChange(file.name, file);
      // Simulate upload progress
      setUploadProgress(100);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const getFileInfo = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toUpperCase() || 'FILE';
    const typeInfo = {
      PDF: '📄 PDF Document',
      JPG: '🖼️ JPEG Image',
      JPEG: '🖼️ JPEG Image',
      PNG: '🖼️ PNG Image',
      DOC: '📝 Word Document',
      DOCX: '📝 Word Document',
    };
    return typeInfo[ext as keyof typeof typeInfo] || `📎 ${ext} File`;
  };

  const displayFileName = currentFile || selectedFile?.name;

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer
          ${dragActive 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/30'
          }
          ${fileError ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input
          type="file"
          id={fileId}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-3">
          {displayFileName ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{getFileInfo(displayFileName)}</p>
                <p className="text-xs text-gray-600 mb-2">{displayFileName}</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {language === 'hi' ? 'फ़ाइल डालें या क्लिक करें' : 'Drag & drop your file or click'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'hi' 
                    ? `अपना प्रमाण दस्तावेज़ अपलोड करें (${maxSize}MB तक)`
                    : `Upload your proof document (up to ${maxSize}MB)`
                  }
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {language === 'hi'
                    ? `स्वीकृत: ${accept}`
                    : `Accepted: ${accept}`
                  }
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 text-center">{uploadProgress}% {language === 'hi' ? 'अपलोड किया जा रहा है' : 'Uploading'}</p>
        </div>
      )}

      {/* File Info */}
      {displayFileName && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-green-700 font-medium">
              ✅ {language === 'hi' ? 'फ़ाइल तैयार है' : 'File Ready'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {language === 'hi' ? 'आपकी फ़ाइल सफलतापूर्वक अपलोड की गई है' : 'Your proof document has been uploaded successfully'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setSelectedFile(null);
              setUploadProgress(0);
              onFileChange('', null);
              // Reset input
              const input = document.getElementById(fileId) as HTMLInputElement;
              if (input) input.value = '';
            }}
            className="ml-2 text-green-600 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Messages */}
      {(fileError || error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{fileError || error}</p>
        </div>
      )}

      {/* Voice Instruction */}
      {voicePrompt && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 italic">{voicePrompt}</p>
        </div>
      )}

      {/* Voice Button */}
      {onStartRecording && (
        <Button
          onClick={isListening ? onStopRecording : onStartRecording}
          variant="outline"
          className={`w-full h-12 border-2 transition-all duration-200 ${
            isListening
              ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-purple-300 text-purple-600 hover:bg-purple-50'
          }`}
        >
          {isListening ? '⏹️ Stop Recording' : '🎙️ Describe Your Document'}
        </Button>
      )}
    </div>
  );
}

export default FileUpload;
