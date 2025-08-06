'use client';

import { useState } from 'react';

import { useUploadFileMutation } from '@/utils/queries';

interface UploadFileModalProps {
  folderId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadFileModal({
  folderId,
  onClose,
  onSuccess,
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const { uploadFile, isLoading, error } = useUploadFileMutation();

  const handleSubmit = async () => {
    if (!file) return;

    try {
      await uploadFile({
        file,
        folderId,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload File</h2>
        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {error && <p className="text-red-600 text-sm mb-2">Failed to upload file</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !file}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
