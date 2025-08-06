'use client';

import { useState } from 'react';

import { Folder } from '@/interfaces';
import Modal from './ui/modal';

interface CreateFolderModalProps {
  parentId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
  createFolder: (data: { name: string; parentId: number | null }) => Promise<Folder>;
  isLoading: boolean;
  error: Error | null;
}

export default function CreateFolderModal({
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
    <Modal
      title="Create New Folder"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      isDisabled={!name.trim()}
      confirmText="Create"
      error={error?.message ?? null}
    >
      <input
        type="text"
        placeholder="Folder name"
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
        autoFocus
      />
    </Modal>
  );
}
