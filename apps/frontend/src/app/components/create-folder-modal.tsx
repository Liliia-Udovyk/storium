'use client';

import { useState } from 'react';

import { Folder } from '@/interfaces';

interface CreateFolderModalProps {
  parentId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
  createFolder: (data: { name: string; parentId: number | null }) => Promise<Folder>;
  isLoading: boolean;
  error: Error | null;
}

export function CreateFolderModal({
  parentId,
  onClose,
  onSuccess,
  createFolder,
  isLoading,
  error,
}: CreateFolderModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await createFolder({ name, parentId });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
        <input
          type="text"
          placeholder="Folder name"
          className="w-full border border-gray-300 px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
        {error && <p className="text-red-600 text-sm mb-2">Failed to create folder</p>}
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
            disabled={isLoading || !name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFolderModal;
