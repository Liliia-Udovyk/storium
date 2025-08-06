'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadFileModalProps {
  folderId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
  uploadFile: (data: { file: File; folderId: number | null }) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function UploadFileModal({
  folderId,
  onClose,
  onSuccess,
  uploadFile,
  isLoading,
  error,
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      await uploadFile({ file, folderId });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload File</h2>
        <p className="text-sm text-gray-500 mb-4">Choose a file to upload into this folder</p>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="group border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 transition mb-4"
        >
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
          <p className="text-gray-500 text-sm">
            {file ? (
              <span className="font-medium text-gray-800">{file.name}</span>
            ) : (
              <>
                Drag & drop a file here or <span className="text-blue-600 underline">browse</span>
              </>
            )}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-2">
            {error.message || 'Failed to upload file'}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadFileModal;
