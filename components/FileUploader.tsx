import React, { useRef, useState } from 'react';
import { Upload, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { ALLOWED_FILE_TYPES } from '../constants';

interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ files, onFilesChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesChange([...files, ...newFiles]);
    }
    // Reset input so same file can be selected again if deleted
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={ALLOWED_FILE_TYPES}
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center text-slate-500">
          <Upload size={32} className="mb-2 text-blue-500" />
          <p className="font-medium text-slate-700">클릭하거나 파일을 여기로 드래그하세요</p>
          <p className="text-xs text-slate-400 mt-1">
            지원: PDF, Word, HWP, 텍스트, Excel, PPTX 등
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">업로드된 파일 ({files.length})</h4>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-blue-100 p-2 rounded text-blue-600">
                  <FileIcon size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-800 truncate">{file.name}</span>
                  <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-400 hover:text-red-500 p-1"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {files.length === 0 && (
         <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-sm rounded-md flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0"/>
            <p>초안 생성을 위해 최소 1개 이상의 참고 자료를 업로드해주세요.</p>
         </div>
      )}
    </div>
  );
};

export default FileUploader;