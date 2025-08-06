'use client';

import { useState } from 'react';

import { useCreateFolderMutation } from '@/utils/queries';

interface CreateFolderModalProps {
  parentId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateFolderModal({
  parentId,
  onClose,
  onSuccess,
}: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const { createFolder, isLoading, error } = useCreateFolderMutation();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      await createFolder({ name, parentId });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
        <input
          type="text"
          placeholder="Folder name"
          className="w-full border px-3 py-2 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm mb-2">Failed to create folder</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
