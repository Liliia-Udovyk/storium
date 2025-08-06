'use client';

import { useState } from 'react';

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

  const handleSubmit = async () => {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Upload File</h2>
        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isLoading}
          autoFocus
        />
        {error && <p className="text-red-600 text-sm mb-2">Failed to upload file</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !file}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadFileModal;
