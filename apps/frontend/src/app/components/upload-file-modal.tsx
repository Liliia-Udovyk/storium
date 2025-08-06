'use client';

import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

import Modal from './ui/modal';

interface UploadFileModalProps {
  folderId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
  uploadFile: (data: { file: File; folderId: number | null }) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export default function UploadFileModal({
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
    <Modal
      title="Upload File"
      description="Choose a file to upload into this folder"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleUpload}
      isLoading={isLoading}
      isDisabled={!file}
      confirmText="Upload"
      error={error?.message ?? null}
    >
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
    </Modal>
  );
}
